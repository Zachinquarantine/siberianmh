import { PullRequest as DBPullRequest } from '../../entities/pull-request'
import { GitHubProvider } from '../providers'
import { timer } from '../timer'
import { IAddPullRequest, Mergeability } from '../types'

export class PullRequestStore {
  private github: GitHubProvider

  public constructor() {
    this.github = new GitHubProvider()
  }

  public async addPullRequest(
    opts: IAddPullRequest,
  ): Promise<false | DBPullRequest> {
    if (!opts.provider) {
      opts.provider = 'github'
    }

    const duplicate = await DBPullRequest.findOne({
      where: {
        owner: opts.owner,
        repository: opts.repository,
        pr_number: opts.pr_number,
        provider: opts.provider,
      },
    })

    if (duplicate) {
      /**
       * throw new ErrorHandler(
       *   404,
       *   `Pull request ${opts.pr_number} already added into the database`
       * )
       */
      return false
    }

    if (opts.provider === 'github') {
      return this.addGitHubPullRequest(opts)
    }

    return false
  }

  public async addGitHubPullRequest(opts: IAddPullRequest) {
    const { data: pr } = await this.github.getPull({
      owner: opts.owner,
      repo: opts.repository,
      pull_request: opts.pr_number,
    })

    await this.github.createStatus({
      owner: opts.owner,
      repo: opts.repository,
      state: 'pending',
      sha: pr.head.sha,
    })

    if (pr.state !== 'open') {
      // TODO: return a error
      return false
    }

    const dbPr = DBPullRequest.create({
      owner: opts.owner,
      repository: opts.repository,
      pr_number: opts.pr_number,
      mergeable: pr.mergeable,
      html_url: pr.html_url,
      branch: pr.head.ref,
      provider: opts.provider,
      merge_method: opts.merge_method,
    })

    await dbPr.save()

    if (!this.getMergeability(opts)) {
      await this.github.createStatus({
        owner: opts.owner,
        repo: opts.repository,
        state: 'failure',
        sha: pr.head.sha,
        description: 'Pull Request is not mergeable',
      })
    } else {
      await this.github.createStatus({
        owner: opts.owner,
        repo: opts.repository,
        state: 'success',
        sha: pr.head.sha,
        description: 'All checks successfully passed',
      })
    }

    await this.github.setBasedStatus(
      opts.owner,
      opts.repository,
      opts.pr_number,
    )

    return dbPr
  }

  private checkMergeability = async (pr: IAddPullRequest) => {
    const {
      data: { mergeable },
    } = await this.github.getPull({
      owner: pr.owner,
      repo: pr.repository,
      pull_request: pr.pr_number,
    })

    if (mergeable === true) {
      return Mergeability.MERGEABLE
    } else if (mergeable === false) {
      return Mergeability.UNMERGEABLE
    } else {
      return Mergeability.UNKNOWN
    }
  }

  private getMergeability = async (pr: IAddPullRequest): Promise<boolean> => {
    let isMergeable = Mergeability.UNKNOWN
    let retriesLeft = 3

    while (isMergeable !== Mergeability.MERGEABLE && retriesLeft > 0) {
      isMergeable = await this.checkMergeability(pr)

      if (isMergeable !== Mergeability.MERGEABLE) {
        // wait some time before we check again
        await timer(5_000)
        retriesLeft--
      }
    }

    return isMergeable === Mergeability.MERGEABLE
  }

  public async mergeSecondQueue() {
    const prs = await DBPullRequest.find({
      where: { state: 'open' },
    })

    for (const pr of prs) {
      const firstLabel = await this.github.getBasedStatus(
        pr.owner,
        pr.repository,
        pr.pr_number,
      )
      const secondLabel = await this.github.getSecondLabel(
        pr.owner,
        pr.repository,
        pr.pr_number,
      )

      if (firstLabel && secondLabel) {
        await this.github.removeFirstLabel(
          pr.owner,
          pr.repository,
          pr.pr_number,
        )

        await this.github
          .mergePullRequest(
            pr.owner,
            pr.repository,
            pr.pr_number,
            pr.branch,
            pr.merge_method,
          )
          .then(() => {
            DBPullRequest.update(
              {
                owner: pr.owner,
                repository: pr.repository,
                pr_number: pr.pr_number,
              },
              { state: 'closed' },
            )
          })
      }
    }
  }

  public async checkPullRequests() {
    const prs = await DBPullRequest.find({ where: { state: 'open' } })

    for (const pr of prs) {
      const { data: ghPr } = await this.github.getPull({
        owner: pr.owner,
        repo: pr.repository,
        pull_request: pr.pr_number,
      })

      const secondLabel = await this.github.getSecondLabel(
        pr.owner,
        pr.repository,
        pr.pr_number,
      )
      if (!secondLabel) {
        await this.github.setBasedStatus(pr.owner, pr.repository, pr.pr_number)
      }

      await DBPullRequest.update(
        {
          id: pr.id,
        },
        { mergeable: ghPr.mergeable },
      )
    }
  }
}

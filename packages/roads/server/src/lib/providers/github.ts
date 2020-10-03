import { Octokit } from '@octokit/rest'
import { labels } from '../constants'
import { IGetPullRequest, MergeMethods } from '../types'

export class GitHubProvider {
  public octokit: Octokit
  private firstBasedLabel = labels.cqPlusOne
  private secondBasedLabel = labels.cqPlusTwo

  public constructor() {
    this.octokit = new Octokit({
      auth: process.env.GH_TOKEN,
    })
  }

  public async getPull(opts: IGetPullRequest) {
    return this.octokit.pulls.get({
      owner: opts.owner,
      repo: opts.repo,
      pull_number: opts.pull_request,
    })
  }

  public async createStatus(
    owner: string,
    repo: string,
    state: 'error' | 'failure' | 'pending' | 'success',
    sha: string,
    description?: string,
  ) {
    return this.octokit.repos.createCommitStatus({
      owner,
      repo,
      sha,
      state,
      description,
      context: 'roads/commit-queue',
    })
  }

  public async getBasedStatus(owner: string, repo: string, pr_number: number) {
    const { data: labels } = await this.octokit.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number: pr_number,
    })

    for (const label of labels) {
      if (label.name === this.firstBasedLabel) {
        return true
      }
    }

    return false
  }

  public async setBasedStatus(owner: string, repo: string, pr_number: number) {
    if (await this.getBasedStatus(owner, repo, pr_number)) {
      return null
    }

    return this.octokit.issues.addLabels({
      owner,
      repo,
      issue_number: pr_number,
      labels: [this.firstBasedLabel],
    })
  }

  public async getSecondLabel(owner: string, repo: string, pr_number: number) {
    const { data: labels } = await this.octokit.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number: pr_number,
    })

    for (const label of labels) {
      if (label.name === this.secondBasedLabel) {
        return true
      }
    }

    return false
  }

  public async removeFirstLabel(
    owner: string,
    repo: string,
    pr_number: number,
  ) {
    return await this.octokit.issues.removeLabel({
      owner,
      repo,
      issue_number: pr_number,
      name: this.firstBasedLabel,
    })
  }

  public async mergePullRequest(
    owner: string,
    repo: string,
    pr_number: number,
    branch?: string,
    merge_method?: MergeMethods,
  ) {
    await this.octokit.pulls.merge({
      owner,
      repo,
      pull_number: pr_number,
      merge_method,
    })

    if (branch) {
      await this.octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      })
    }
  }
}

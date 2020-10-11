import * as express from 'express'
import { createQueryBuilder } from 'typeorm'
import { Repository } from '../../entities/repo'
import { ciJobsQueue, notificationsQueue } from '../queue'
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import { IJob, ICreateJobStatus, IUser } from '@ozark/types'
import { v4 } from 'uuid'
import { paginateRest } from '@octokit/plugin-paginate-rest'
import { waiter } from '../waiter'
import { RepoJobs, RepoJobsRuns } from '../../entities/status'
import axios from 'axios'
import * as url from 'url'
import { allowedHosts } from '../allowed-hosts'
import { User } from '../../entities/user'

export class CIStore {
  private RETRY_WAIT_TIME: number = 5_000

  /**
   * For more understanding why we do not handle job status here
   * need to understand how does CI works. When we receive the
   * request for this route the CI is still be run as they awaited
   * to a response from the server, any response (404 or 200).
   *
   * If we are started handling, we get the CI is still run instead
   * of `failure` or `passed` what are we await from that.
   *
   * One thing that here we handle it's for the existing repository
   * if the repository is not in the database we return the 404.
   *
   * In all other cases we response dummy (200) response that we
   * accepted that request and added them to a queue where these
   * job is handled after successfully or not finishing of CI process.
   *
   * For more understanding the queue processing
   * you would check `processJob` function and `lib/queue.ts`
   * file.
   *
   * FAQ:
   *
   * 1. Why just not make dummy responses and continue handling?
   *
   * A: Yes, that can be a solution, but let's understand that we
   * can get around 100 requests per second (next RPS) for this
   * route and also await the real response from the CI provider.
   * This creates a big timeout for this route.
   */
  public handleStatus = async (req: express.Request, res: express.Response) => {
    const { repository } = req.body

    if (!repository) {
      return res.status(500).json({
        status: 500,
        message: 'Unable to find the repoository',
      })
    }

    const headers = req.headers
    const [owner, name] = repository.split('/')

    const repo = await Repository.findOne({
      where: { owner: owner, name: name },
    })

    if (!repo) {
      return res.status(404).json({
        status: 404,
        message: 'Repository not found',
      })
    }

    if (!repo.github_access_token) {
      return res.status(400).json({
        status: 400,
        message: 'GitHub Personal Access Token is required to usage',
      })
    }

    if (false) {
      if (
        !headers['x-ozark-secret'] ||
        headers['x-ozark-secret'] !== repo!.secret
      ) {
        return res.status(403).json({
          status: 403,
          message: 'Not authorized',
        })
      }
    }

    const data = {
      id: v4(),
      ...req.body,
    }

    await ciJobsQueue.add(data)

    return res.status(201).json({
      status: 201,
      message: 'Successfully added',
    })
  }

  /**
   * It's just a roulette, you can win or just get a report back.
   * That how lucky you decide the job what's this function received.
   */
  public reportBackManager = async (job: any) => {
    console.log(job.data.id)
    const runs = await RepoJobsRuns.find({
      where: { job_id: job.data.id },
      order: { id: 'DESC' },
      relations: ['repository'],
    })

    const repository = runs[0].repository

    if (typeof repository === 'number') {
      // TODO: Just do something with that
      return console.log(`[${repository}] Run: ${runs}`)
    }

    const checkForFail = runs.slice(0, repository.fails_in_row)
    if (checkForFail.every((status) => status.result === 'failure')) {
      // Here should be the Slack app, but that not be here because
      // I'm lazy and didn't understand the big Slack documentation,
      // so currently that use Webhooks, maybe someday has the
      // integration with Slack but currently plans for Discord.
      //
      // If that message still here after the public release that means
      // I'm very lazy to change that to something normal, sorry. 😃

      const job = await RepoJobs.findOne({ where: { id: runs[0].job_id } })

      if (!job) {
        console.log(`Unable to find original job for run ${runs[0]}`)
      }

      const message = `
👋 Looks the the last ${
        repository.fails_in_row
      } builds for repository \`https://github.com/${repository.owner}/${
        repository.name
      }\` and job \`${job!.name}\` failed.

You can check the logs for that buils by the links below:
${checkForFail.map((check) => `- ${check.html_url}`).join('\n')}
`

      const host = url.parse(repository.webhook_url).host
      if (!allowedHosts.includes(host!)) {
        return
      }

      // Slack
      if (repository.webhook_url.startsWith('https://hooks.slack.com')) {
        axios.post(repository.webhook_url, {
          text: message,
        })
      } else if (
        // Can be discordapp.com or discord.com.
        repository.webhook_url.startsWith('https://discordapp.com') ||
        repository.webhook_url.startsWith('https://discord.com')
      ) {
        axios.post(repository.webhook_url, {
          content: message,
        })
      }
    }

    return
  }

  /**
   * This function handles all jobs inside the queue.
   */
  public processJob = async (job: IJob) => {
    switch (job.provider) {
      case 'github': {
        await this.handleGitHubStatus(job)
        break
      }
      default: {
        console.log('[PANIC] Unable to parse the provider')
        break
      }
    }
  }

  //#region Acceptors
  private handleGitHubStatus = async (job: IJob) => {
    let retriesLeft: number = 5
    let workflowRunInfo:
      | RestEndpointMethodTypes['actions']['getWorkflowRun']['response']
      | null = null
    const [owner, repo] = job.repository.split('/')

    const repository = await Repository.findOne({
      where: { owner: owner, name: repo },
    })

    if (!repository?.github_access_token) {
      console.log('[PANIC] Token is not found')
      // TODO: Need a panic?
      return
    }

    const github = new Octokit({
      auth: repository.github_access_token,
    })

    const getWorkflowRun = async () => {
      return await github.actions.getWorkflowRun({
        owner: owner,
        repo: repo,
        run_id: job.workflow_id,
      })
    }

    while (
      (!workflowRunInfo || workflowRunInfo.data.status !== 'completed') &&
      retriesLeft > 0
    ) {
      workflowRunInfo = await getWorkflowRun()

      if (workflowRunInfo.data.status !== 'completed') {
        // Let's sit some more time.
        await waiter(this.RETRY_WAIT_TIME)
        retriesLeft--
      }
    }

    console.log(workflowRunInfo)

    if (!workflowRunInfo) {
      // TODO: Do something, panic for example
      console.log(
        'Unable to get workflow run info for repository:',
        job.repository,
      )
      return
    }

    if (workflowRunInfo.data.head_branch !== 'master') {
      // TODO: Make something with that info
      console.log('Branch is not master')
      return
    }

    const { data: workflowInfo } = await github.actions.getWorkflow({
      owner: owner,
      repo: repo,
      workflow_id: workflowRunInfo.data.workflow_id,
    })

    const status = await this.createJobStatus({
      provider: job.provider,
      name: workflowInfo.name,
      sha: job.sha,
      branch: workflowRunInfo.data.head_branch,
      result:
        workflowRunInfo.data.conclusion === 'success' ? 'success' : 'failure',
      html_url: workflowRunInfo.data.html_url,
      repository: repository!.id,
    })

    console.log(status)
    return
  }
  //#endregion

  private async createJobStatus(opts: ICreateJobStatus) {
    let job = await RepoJobs.findOne({
      where: { name: opts.name, repository: opts.repository },
    })
    if (!job) {
      job = await this.createJob(opts)
    }

    const run_id = await this.incrementRunId(opts, job)

    const db = RepoJobsRuns.create({
      provider: opts.provider,
      job_id: job?.id,
      run_id: run_id,
      repository: opts.repository,
      sha: opts.sha,
      branch: opts.branch,
      result: opts.result,
      html_url: opts.html_url,
    })

    await db.save()

    if (db.result === 'failure') {
      notificationsQueue.add(job)
    }

    return db
  }

  private async createJob(opts: ICreateJobStatus) {
    const db = RepoJobs.create({
      name: opts.name,
      provider: opts.provider,
      repository: opts.repository,
    })

    await db.save()

    return db
  }

  private async incrementRunId(opts: ICreateJobStatus, job: RepoJobs) {
    const runs = await RepoJobsRuns.find({
      where: { job_id: job?.id },
      order: { id: 'DESC' },
    })

    if (!runs[0] || runs[0].run_id === 0 || !runs[0].run_id) {
      return 1
    }

    return runs[0].run_id + 1
  }

  private async userIsWithWriteAccess(
    user: IUser,
    username: string,
    dbRepo: Repository,
  ) {
    const github = new Octokit({
      auth: user.accessToken,
    })

    const { data: perms } = await github.repos.getCollaboratorPermissionLevel({
      owner: username,
      repo: dbRepo!.name,
      username: user.user.username,
    })

    if (perms.permission === 'read') {
      return false
    }

    return true
  }

  //#region API Methods
  public async getRepository(req: express.Request) {
    const user = req.user as IUser
    const { username, repo } = req.params

    const repoUser = await User.findOne({ where: { username: username } })
    const dbRepo = await Repository.findOne({
      where: { user: repoUser!.id, name: repo },
    })

    if (!this.userIsWithWriteAccess(user, username, dbRepo!)) {
      return false
    }

    return dbRepo
  }

  public async getAllRepositories(req: express.Request) {
    const user = req.user as IUser
    const customOctokit = Octokit.plugin(paginateRest)
    const github = new customOctokit({ auth: user.accessToken })

    const allRepos: RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'] = await github.paginate(
      'GET /user/repos',
      {
        per_page: 100,
      },
    )

    const reposWithPush = allRepos
      // @ts-expect-error
      .filter((r) => r.permissions.push)
      // @ts-expect-error
      .map((r) => ({
        id: `${r.id}`,
        repoName: r.name,
        repoOwner: r.owner.login,
      }))

    const configured = await createQueryBuilder(Repository, 'repo')
      .where('repo.owner IN (:...reposOwners)', {
        // @ts-expect-error
        reposOwners: reposWithPush.map((r) => r.repoOwner),
      })
      .where('repo.name IN (:...reposNames)', {
        // @ts-expect-error
        reposNames: reposWithPush.map((r) => r.repoName),
      })
      .getMany()

    return configured
  }

  public async getAllStatusesForRepo(req: express.Request) {
    const user = req.user as IUser
    const { username, repo } = req.params

    const repoUser = await User.findOne({ where: { username: username } })
    const dbRepo = await Repository.findOne({
      where: { user: repoUser!.id, name: repo },
    })

    if (!dbRepo) {
      console.log('panic')
      // TODO: PANIC
      return
    }

    if (!this.userIsWithWriteAccess(user, username, dbRepo)) {
      return false
    }

    const jobsRuns = await RepoJobsRuns.find({
      where: { repository: dbRepo.id },
      order: { id: 'DESC' },
    })

    return jobsRuns
  }

  public async getAllJobsPerRepo(req: express.Request) {
    const user = req.user as IUser
    const { username, repo } = req.params

    const repoUser = await User.findOne({ where: { username: username } })
    const dbRepo = await Repository.findOne({
      where: { user: repoUser!.id, name: repo },
    })

    if (!dbRepo) {
      return console.log('somewhere panic')
      // TODO: Panic
    }

    if (!this.userIsWithWriteAccess(user, username, dbRepo)) {
      return false
    }

    const jobs = await RepoJobs.find({
      where: { repository: dbRepo.id },
    })

    return jobs
  }
  //#endregion
}

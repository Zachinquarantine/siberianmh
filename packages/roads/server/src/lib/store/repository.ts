import * as express from 'express'
import { PullRequestStore } from './pull-request'
import { MergeQueueStore } from './merge-queue'
import { labels } from '../constants'

export class RepositoryStore {
  private pullRequest: PullRequestStore
  private mergeQueue: MergeQueueStore

  public constructor() {
    this.pullRequest = new PullRequestStore()
    this.mergeQueue = new MergeQueueStore()
  }

  /**
   * Handles the GitHub webhooks
   */
  public async handleGitHubWebhook(req: express.Request) {
    // TODO:
    //  - Should we handle unlabel?
    const { body } = req

    // console.log(body)

    // Pull Request Opened
    if (body.action === 'opened' && body.pull_request) {
      const { repository } = body

      await this.pullRequest.addPullRequest({
        owner: repository.owner.login,
        repository: repository.name,
        pr_number: body.number,
        merge_method: 'merge',
        provider: 'github',
      })
    }

    // Pull Request Synchronized
    if (body.action === 'synchronize' && body.pull_request) {
      const { repository } = body

      await this.pullRequest.syncronizePullRequest({
        owner: repository.owner.login,
        repository: repository.name,
        pr_number: body.number,
        provider: 'github',
      })
    }

    // Pull Request labeled
    if (body.action === 'labeled' && body.pull_request) {
      // Labeled by CQ+1
      if (body.label.name === labels.cqPlusOne) {
        const { repository } = body

        await this.pullRequest.addPullRequest({
          owner: repository.owner.login,
          repository: repository.name,
          pr_number: body.number,
          merge_method: 'merge',
          provider: 'github',
        })
      }

      // Labeled by CQ+2
      if (body.label.name === labels.cqPlusTwo) {
        const { repository } = body

        // Before of all need to verify that we still is fine
        try {
          await this.pullRequest.syncronizePullRequest({
            owner: repository.owner.login,
            repository: repository.name,
            pr_number: body.number,
            provider: 'github',
          })
        } catch (e) {
          console.log(e)
        }

        // TODO: Maybe should merge only the updated pull request
        await this.mergeQueue.addPullRequest()
      }
    }

    // TODO: Pull Request Unlabeled

    // TODO: Pull Request Reopened

    // Pull Request Closed
    if (body.action === 'closed' && body.pull_request) {
      const { repository } = body

      await this.pullRequest.closePullRequest({
        owner: repository.owner.login,
        repository: repository.name,
        pr_number: body.number,
        provider: 'github',
      })
    }
  }

  /**
   * Handles GitLab webhooks
   */
  public async handleGitLabWebhook(req: express.Request) {
    const { body } = req

    console.log(body)

    // Pull Request Opened
    if (body.object_attributes.action === 'open') {
      await this.pullRequest.addPullRequest({
        owner: body.user.username,
        repository: body.project.name,
        project_id: body.project.id,
        merge_method: 'merge',
        pr_number: body.object_attributes.iid,
        provider: 'gitlab',
      })
    }

    // Pull Request Updated
    if (body.object_attributes.action === 'update') {
      console.log('Update pull request')
    }
  }
}

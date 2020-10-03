import * as express from 'express'
import { PullRequestStore } from './pull-request'
import { labels } from '../constants'

export class RepositoryStore {
  private pullRequest: PullRequestStore

  public constructor() {
    this.pullRequest = new PullRequestStore()
  }

  public async handleWebhook(req: express.Request) {
    const { body } = req

    console.log(body)

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
      // TODO: Run the check squite for verifying ability to merge
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
        // TODO: Maybe should merge only the updated pull request
        await this.pullRequest.mergeSecondQueue()
      }
    }
  }
}

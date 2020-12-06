import { MergeQueue } from '../../entities/merge-queue'

export class MergeQueueStore {
  // TODO: Add pull request to the last merge queue
  public async addPullRequest() {}

  // TODO: Remove pull request and update positions
  public async removePullRequest() {}

  public async mergePullRequests() {
    const mergeRequests = await MergeQueue.find({
      where: { position: 1 },
      relations: ['pull_request'],
    })

    for (const mergeRequest of mergeRequests) {
      if (!mergeRequest) {
        return
      }

      console.log(mergeRequest)
    }
  }
}

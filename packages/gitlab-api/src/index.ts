import { CommitsResource } from './api/commits'
import { MergeRequest } from './api/merge-request'
import { Base } from './lib/base'
import { IOptions } from './lib/types'

export class GitLab extends Base {
  public commits: CommitsResource
  public mergeRequest: MergeRequest

  public constructor(opts?: IOptions) {
    super(opts)

    this.commits = new CommitsResource(opts)
    this.mergeRequest = new MergeRequest(opts)
  }
}

// Export all types what's we provide
export * from './lib/types'

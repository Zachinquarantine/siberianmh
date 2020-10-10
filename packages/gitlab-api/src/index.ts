import { MergeRequest } from './api/merge-request'
import { Base } from './lib/base'
import { IOptions } from './lib/types'

export class GitLab extends Base {
  public mergeRequest: MergeRequest

  public constructor(opts?: IOptions) {
    super(opts)

    this.mergeRequest = new MergeRequest()
  }
}

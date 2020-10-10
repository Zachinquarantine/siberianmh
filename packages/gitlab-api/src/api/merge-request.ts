import { Base } from '../lib/base'
import {
  IGetMergeRequestOptions,
  IGitLabMergeRequest,
} from '../lib/types/merge-request'

export class MergeRequest extends Base {
  public async getMergeRequest(opts: IGetMergeRequestOptions) {
    return this.request<any, IGitLabMergeRequest>(
      `projects/${opts.project_id}/merge_requests/${opts.merge_request_iid}`,
    )
  }
}

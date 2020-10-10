import { Base } from '../lib/base'
import {
  IGetMergeRequestOptions,
  IGitLabMergeRequest,
  IUpdateMergeRequestOptions,
} from '../lib/types/merge-request'

export class MergeRequest extends Base {
  public async getMergeRequest(opts: IGetMergeRequestOptions) {
    return this.request<any, IGitLabMergeRequest>({
      url: `projects/${opts.project_id}/merge_requests/${opts.merge_request_iid}`,
    })
  }

  public async updateMergeRequest(opts: IUpdateMergeRequestOptions) {
    const data = {
      add_labels: opts.add_labels,
    }

    return this.request<{ add_labels: string }, IGitLabMergeRequest>({
      url: `projects/${opts.project_id}/merge_requests/${opts.merge_request_iid}`,
      method: 'PUT',
      data,
    })
  }
}

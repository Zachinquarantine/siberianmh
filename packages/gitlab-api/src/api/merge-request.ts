import { Base } from '../lib/base'
import {
  IGetMergeRequestOptions,
  IGitLabMergeRequest,
  IUpdateMergeRequestOptions,
  IAcceptMergeRequestOptions,
} from '../lib/types/merge-request'

export class MergeRequest extends Base {
  public async getMergeRequest(opts: IGetMergeRequestOptions) {
    return this.request<any, IGitLabMergeRequest>({
      url: `projects/${opts.project_id}/merge_requests/${opts.merge_request_iid}`,
    })
  }

  public async acceptMergeRequest(opts: IAcceptMergeRequestOptions) {
    const data = {
      ...opts,
    }

    return this.request<IAcceptMergeRequestOptions>({
      url: `projects/${opts.project_id}/merge_requests/${opts.merge_request_iid}/merge`,
      method: 'PUT',
      data,
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

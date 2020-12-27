import { AxiosResponse } from 'axios'
import { Base } from '../lib/base'
import { ICreateStatusOptions } from '../lib/types/commits'

export class CommitsResource extends Base {
  public createCommitStatus(
    opts: ICreateStatusOptions,
  ): Promise<AxiosResponse<any>> {
    return this.request({
      url: `projects/${opts.project_id}/statuses/${opts.sha}`,
      method: 'POST',
      data: {
        ...opts,
        state: opts.state,
      },
    })
  }
}

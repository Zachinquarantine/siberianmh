import { IMonobankOptions } from '../types'
import { IInitializeRequestParams, ITokenRequest } from '../types/corp-api'
import { Base } from './base'

export class CorpAPI extends Base {
  public constructor(opts?: IMonobankOptions) {
    super(opts)
  }

  /**
   * Create a request for accessing client data.
   */
  public async initializeAccess(opts?: IInitializeRequestParams) {
    return await this.request<ITokenRequest>('/personal/auth/request', 'POST')
  }
}

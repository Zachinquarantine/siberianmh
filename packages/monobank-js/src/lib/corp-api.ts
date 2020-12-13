import { IMonobankOptions } from '../types'
import {
  IInitializeAccessParams,
  ITokenRequest,
  ICheckAccessParams,
  IGetClientInfoParams,
  IGetClientInfoResponse,
} from '../types/corp-api'
import { Base } from './base'

export class CorpAPI extends Base {
  public constructor(opts?: IMonobankOptions) {
    super(opts)
  }

  /**
   * Create a request for accessing client data.
   */
  public async initializeAccess(opts: IInitializeAccessParams) {
    const headers = {
      'X-Key-Id': opts.keyId,
      'X-Time': opts.time,
      'X-Permissions': opts.permissions,
      'X-Sign': opts.sign,
    }

    if (opts.callback) {
      // @ts-expect-error
      headers['X-Callback'] = opts.callback
    }

    return await this.request<ITokenRequest>({
      url: '/personal/auth/request',
      method: 'POST',
      headers,
    })
  }

  /**
   * Check the status of request for access the customer data.
   */
  public async checkAccess(opts: ICheckAccessParams) {
    return await this.request({
      url: '/personal/auth/request',
      headers: {
        'X-Key-Id': opts.keyId,
        'X-Time': opts.time,
        'X-Request-Id': opts.requestId,
        'X-Sign': opts.sign,
      },
    })
  }

  /**
   * Get the information about the client and his list of accounts.
   */
  public async getClientInfo(opts: IGetClientInfoParams) {
    return await this.request<IGetClientInfoResponse>({
      url: '/personal/client-info',
      headers: {
        'X-Key-Id': opts.keyId,
        'X-Time': opts.time,
        'X-Request-Id': opts.requestId,
        'X-Sign': opts.sign,
      },
    })
  }
}

import { Base } from './lib/base'
import {
  IGetCurrencyResponse,
  IGetClientInfo,
  ICreateWebhookRequest,
  IGetClientStatementRequest,
  IGetClientStatementResponse,
  IMonobankOptions,
} from './types'

export class Monobank extends Base {
  public constructor(opts?: IMonobankOptions) {
    super(opts)
  }

  public async getCurrency() {
    return await this.request<Array<IGetCurrencyResponse>>('/bank/currency')
  }

  public async getClientInfo() {
    return await this.request<IGetClientInfo>('/personal/client-info')
  }

  public async createWebook(opts: ICreateWebhookRequest) {
    return await this.request<number>('/personal/webhook', 'POST', opts)
  }

  public async getClientStatement(opts: IGetClientStatementRequest) {
    return await this.request<IGetClientStatementResponse>(
      `/personal/statement/${opts.account}/${opts.from}${
        opts.to ? `/${opts.to}` : ''
      }`,
    )
  }
}

import { Base } from './lib/base'
import { CorpAPI } from './lib/corp-api'
import {
  IGetCurrencyResponse,
  IGetClientInfo,
  ICreateWebhookRequest,
  IGetClientStatementRequest,
  IGetClientStatementResponse,
  IMonobankOptions,
} from './types'

export class Monobank extends Base {
  public corp: CorpAPI

  public constructor(opts?: IMonobankOptions) {
    super(opts)

    this.corp = new CorpAPI()
  }

  public async getCurrency() {
    return await this.request<Array<IGetCurrencyResponse>>({
      url: '/bank/currency',
    })
  }

  public async getClientInfo() {
    return await this.request<IGetClientInfo>({
      url: '/personal/client-info',
    })
  }

  public async createWebook(opts: ICreateWebhookRequest) {
    return await this.request<number>({
      url: '/personal/webhook',
      method: 'POST',
      data: opts,
    })
  }

  public async getClientStatement(opts: IGetClientStatementRequest) {
    return await this.request<IGetClientStatementResponse>({
      url: `/personal/statement/${opts.account}/${opts.from}${
        opts.to ? `/${opts.to}` : ''
      }`,
    })
  }
}

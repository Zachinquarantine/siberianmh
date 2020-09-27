import axios, { AxiosResponse } from 'axios'
import {
  IGetCurrencyResponse,
  IGetClientInfo,
  ICreateWebhookRequest,
  IGetClientStatementRequest,
  IGetClientStatementResponse,
} from './types'

interface IMonobankOptions {
  readonly token?: string
}

export class Monobank {
  private token?: string

  public constructor(opts?: IMonobankOptions) {
    this.token = opts?.token
  }

  private async request<R = any>(
    path: string,
    method: 'GET' | 'POST' = 'GET',
    data?: any,
  ): Promise<AxiosResponse<R>> {
    const url = `https://api.monobank.ua${path}`

    const authHeader = this.token
      ? { Authorization: `X-Token ${this.token}` }
      : null

    const result = await axios(url, {
      method: method,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      responseType: 'json',
    })

    return result
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

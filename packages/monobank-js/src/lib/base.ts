import axios, { AxiosResponse, Method } from 'axios'
import { IMonobankOptions } from '../types'

interface IRequestOptions {
  readonly url: string
  readonly method?: Method
  readonly data?: any
  readonly headers?: Record<string, string>
}

export class Base {
  private token?: string

  public constructor(opts?: IMonobankOptions) {
    this.token = opts?.token
  }

  protected async request<R = any>(
    opts: IRequestOptions,
  ): Promise<AxiosResponse<R>> {
    const url = `https://api.monobank.ua${opts.url}`

    const authHeader = this.token
      ? { Authorization: `X-Token ${this.token}` }
      : null

    const result = await axios(url, {
      method: opts.method ?? 'GET',
      data: opts.data,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...opts.headers,
      },
      responseType: 'json',
    })

    return result
  }
}

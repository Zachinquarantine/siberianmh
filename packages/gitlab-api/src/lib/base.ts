import axios, { AxiosResponse, Method as AxiosMethod } from 'axios'
import { IOptions } from './types'

export interface IRequestOptions<T = any> {
  readonly url: string
  method?: AxiosMethod
  readonly data?: T
}

export class Base {
  private hostname: string = 'https://gitlab.com'
  private token: string | null = null

  public constructor(opts?: IOptions) {
    if (opts) {
      this.hostname = opts.hostname!
      this.token = opts.token!
    }
  }

  private generateHeaders() {
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.token}`,
      }
    }

    return headers
  }

  protected async request<T = unknown, U = any>(
    request: IRequestOptions<T>,
  ): Promise<AxiosResponse<U>> {
    if (!request.method) {
      request.method = 'GET'
    }

    const url = `${this.hostname}/api/v4/${request.url}`

    const result = await axios(url, {
      method: request.method,
      responseType: 'json',
      headers: this.generateHeaders(),
      data: request.method,
    })

    return result
  }
}

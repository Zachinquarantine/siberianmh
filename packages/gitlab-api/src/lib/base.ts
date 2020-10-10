import axios, { AxiosResponse, Method as AxiosMethod } from 'axios'
import { IOptions } from './types'

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
    request: string,
    data?: T,
  ): Promise<AxiosResponse<U>>
  protected async request<T = unknown, U = any>(
    request: string,
    method: AxiosMethod,
    data?: T,
  ): Promise<AxiosResponse<U>> {
    if (!method) {
      method = 'GET'
    }

    const url = `${this.hostname}/api/v4/${request}`

    const result = await axios(url, {
      method,
      responseType: 'json',
      headers: this.generateHeaders(),
      data,
    })

    return result
  }
}

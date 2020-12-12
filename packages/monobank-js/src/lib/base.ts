import axios, { AxiosResponse } from 'axios'
import { IMonobankOptions } from '../types'

export class Base {
  private token?: string

  public constructor(opts?: IMonobankOptions) {
    this.token = opts?.token
  }

  protected async request<R = any>(
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
}

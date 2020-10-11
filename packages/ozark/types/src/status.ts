import { Provider } from './provider'

export type IResult = 'success' | 'failure'

export interface ICreateJobStatus {
  readonly provider: Provider
  readonly name: string
  readonly sha: string
  readonly branch: string
  readonly result: IResult
  readonly html_url?: string
  readonly repository: number
}

import { Provider } from './provider'

export interface IJob {
  readonly provider: Provider
  readonly owner: string
  readonly sha: string
  readonly repository: string
  readonly workflow_id: number
}

export interface IJobby {
  readonly id: number
  readonly name: string
  readonly provider: Provider
  readonly created_at: Date
  readonly updated_at: Date
}

export interface IJobStatus {
  readonly branch: string
  readonly html_url: string
  readonly id: number
  readonly job_id: number
  readonly provider: Provider
  readonly result: string
  readonly run_id: number
  readonly sha: string
  readonly created_at: Date
  readonly updated_at: Date
}

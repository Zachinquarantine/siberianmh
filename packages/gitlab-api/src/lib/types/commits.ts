export type ICommitStatusState =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'
  | 'cancelled'

export interface ICreateStatusOptions {
  readonly project_id: number
  readonly sha: string
  readonly state: ICommitStatusState

  readonly ref?: string
  readonly name?: string
  readonly context?: string
  readonly target_url?: string
  readonly description?: string
  readonly coverage?: number
  readonly pipeline_id?: number
}

export interface IGetPullRequest {
  readonly owner: string
  readonly repo: string
  readonly pull_request: number
}

export type IStateStatus = 'error' | 'failure' | 'pending' | 'success'

export interface ICreateStatusOptions {
  readonly owner: string
  readonly repo: string
  readonly state: IStateStatus
  readonly sha: string
  readonly description?: string
}

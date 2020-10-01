export interface IGetPullRequest {
  readonly owner: string
  readonly repo: string
  readonly pull_request: number
}

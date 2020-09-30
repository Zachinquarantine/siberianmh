export interface IAddPullRequest {
  owner: string
  readonly repository: string
  readonly pr_number: number
  provider: 'github' | 'gitlab'
  project_id?: number
  // TODO: Should be 'squash' | 'merge'
  merge_method: string
}

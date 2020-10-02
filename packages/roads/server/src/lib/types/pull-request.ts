export type MergeMethods = 'merge' | 'squash' | 'rebase'

export interface IAddPullRequest {
  owner: string
  readonly repository: string
  readonly pr_number: number
  provider: 'github' | 'gitlab'
  project_id?: number
  merge_method: MergeMethods
}

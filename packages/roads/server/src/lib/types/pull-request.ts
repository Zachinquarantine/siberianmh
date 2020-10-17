export type MergeMethods = 'merge' | 'squash' | 'rebase'
export type Provider = 'github' | 'gitlab'

export interface IAddPullRequest {
  readonly owner: string
  readonly repository: string
  readonly pr_number: number
  provider: Provider
  readonly project_id?: number
  readonly merge_method: MergeMethods
}

export interface ISyncronizePullRequestOptions {
  readonly owner: string
  readonly repository: string
  readonly pr_number: number
  readonly provider: Provider
}

export enum Mergeability {
  MERGEABLE,
  UNMERGEABLE,
  UNKNOWN,
}

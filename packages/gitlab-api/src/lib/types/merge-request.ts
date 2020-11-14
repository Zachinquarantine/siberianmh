import { $TSFixMe } from '.'

export interface IGetMergeRequestOptions {
  readonly project_id: number
  readonly merge_request_iid: number
}

export interface IAcceptMergeRequestOptions {
  readonly project_id: number
  readonly merge_request_iid: number

  readonly merge_commit_message?: string
  readonly squash_commit_message?: string
  readonly squash?: boolean
  readonly should_remove_source_branch?: boolean
  readonly merge_when_pipeline_succeeds?: boolean
  readonly sha?: string
}

export interface IUpdateMergeRequestOptions {
  readonly project_id: number
  readonly merge_request_iid: number

  add_labels: string
}

export interface IGitLabUser {
  readonly id: number
  readonly name: string
  readonly username: string
  readonly state: string
  readonly avatar_url: string
  readonly web_url: string
}

export interface IGitLabMergeRequest {
  readonly id: number
  readonly iid: number
  readonly project_id: number
  readonly title: string
  readonly description: string
  readonly state: string
  readonly created_at: string
  readonly updated_at: string
  readonly merged_by: $TSFixMe
  readonly merged_at: $TSFixMe
  readonly closed_by: $TSFixMe
  readonly closed_at: $TSFixMe
  readonly target_branch: string
  readonly source_branch: string
  readonly user_notes_count: number
  readonly web_url: string
  readonly upvotes: number
  readonly downvotes: number
  readonly author: IGitLabUser
  readonly assigness: Record<string, IGitLabUser>
  readonly assignee: $TSFixMe
  readonly source_project_id: number
  readonly target_project_id: number
  readonly labels: Array<string>
  readonly work_in_progress: boolean
  readonly milestone: $TSFixMe
  readonly merge_when_pipeline_succeeds: boolean
  readonly merge_status: string
  readonly sha: string
  readonly merge_commit_sha: string | null
  readonly squash_commit_sha: string | null
  readonly discussion_locked: null | boolean
  readonly should_remove_source_branch: null | boolean
  readonly force_remove_source_branch: boolean
}

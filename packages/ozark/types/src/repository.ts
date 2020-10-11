export interface IRepository {
  readonly id: number
  readonly owner: string
  readonly name: string
  readonly fails_in_row: number
  readonly webhook_url: string
  readonly secret: string
  readonly github_access_token: string
  readonly created_at: Date
  readonly updated_at: Date
}

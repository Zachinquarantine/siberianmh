export interface IUser {
  readonly accessToken: string
  readonly user: {
    id: number
    avatar_url: string
    username: string
  }
}

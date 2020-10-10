export interface IUser {
  readonly accessToken: string
  readonly user: {
    id: number
    username: string
  }
}

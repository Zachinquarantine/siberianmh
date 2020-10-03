import { IUser } from '../generated/graphql'

export class UserStore {
  public async getViewer(): Promise<IUser> {
    return {
      id: 1,
      username: '1',
      avatar_url: '1',
      email: '1@a.com',
      site_admin: true,
    }
  }
}

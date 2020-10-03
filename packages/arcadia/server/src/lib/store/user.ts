import * as express from 'express'
import { User } from '../../entities/user'
import {
  IUser,
  IMutationRegisterArgs,
  IMutationLoginArgs,
} from '../generated/graphql'
import { ServerError } from '../graphql-error'

export class UserStore {
  //#region Public API Query
  public async getViewer(req: express.Request): Promise<IUser> {
    const userId = req.session!.userId

    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
      throw new ServerError('Unexpected things happened, did you authorized?')
    }

    return user
  }
  //#endregion

  //#region Public API Mutations
  // TODO: Hash the password
  public async register(args: IMutationRegisterArgs): Promise<IUser> {
    const { username, email, password } = args

    const duplicate = await User.findOne({ where: { email }, select: ['id'] })

    if (duplicate) {
      throw new ServerError('User already exists.')
    }

    const user = User.create({
      username,
      password,
      email,
    })

    await user.save()

    return user
  }

  public async login(
    args: IMutationLoginArgs,
    req: express.Request,
  ): Promise<IUser> {
    const user = await User.findOne({ where: { email: args.email } })

    if (!user) {
      throw new ServerError('Unable to find user')
    }

    // TODO: validate password

    req.session!.userId = user.id
    return user
  }
  //#endregion
}

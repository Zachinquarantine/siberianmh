import * as express from 'express'
import { User } from '../../entities/user'
import {
  IUser,
  IMutationRegisterArgs,
  IMutationLoginArgs,
} from '../generated/graphql'
import { ServerError } from '../graphql-error'
import * as argon2 from 'argon2'

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
  public async register(
    args: IMutationRegisterArgs,
    req: express.Request,
  ): Promise<IUser> {
    const { username, email, password } = args

    const duplicate = await User.findOne({ where: { email }, select: ['id'] })

    if (duplicate) {
      throw new ServerError('User already exists.')
    }

    const hash = await argon2.hash(password)

    const user = User.create({
      username,
      password: hash,
      email,
    })

    await user.save()

    req.session!.userId = user.id
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

    const validPassword = await argon2.verify(user.password, args.password)

    if (!validPassword) {
      throw new ServerError('The entered password is not valid.')
    }

    req.session!.userId = user.id
    return user
  }
  //#endregion
}

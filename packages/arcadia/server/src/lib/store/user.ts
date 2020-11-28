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

    if (!userId) {
      throw new ServerError('Unauthorized')
    }

    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
      throw new ServerError('Unauthorized')
    }

    return user
  }

  public async getPublicUser(login: string): Promise<IUser> {
    const user = await User.findOne({ where: { username: login } })

    if (!user) {
      throw new ServerError('User not found')
    }

    return user
  }
  //#endregion

  //#region Public API Mutations
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
      verified: false,
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

  //#region Internal API
  public async getUser(id: number) {
    const user = await User.findOne({ where: { id: id } })

    if (!user) {
      return false
    }

    return user
  }
  //#endregion
}

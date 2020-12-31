import * as express from 'express'
import { HelpUser } from '../../entities/help-user'

export class HelpChannelStore {
  public async getHelpChannel(req: express.Request) {
    const { userId } = req.params

    const helpUser = await HelpUser.findOne({ where: { user_id: userId } })

    if (!helpUser) {
      return {
        message: 'User not found',
        status: 404,
      }
    }

    return helpUser
  }

  public async createHelpChannel(req: express.Request) {
    const {} = req.body
  }
}

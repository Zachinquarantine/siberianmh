import * as uuid from 'uuid'
import * as express from 'express'
import { ACL } from '../../entities/acl'

export class ACLStore {
  public async generateRootToken() {
    const tokens = await ACL.find()

    if (tokens.length < 1) {
      const created = ACL.create({
        token: uuid.v4(),
      })

      await created.save()

      return created.token
    }

    return
  }

  public async generateACL() {
    const acl = ACL.create({
      token: uuid.v4(),
    })

    await acl.save()

    return acl.token
  }

  // TODO: Ensure tokens more than 1 before deletion
  public async deleteACL(req: express.Request) {
    const token = req.params.token

    if (!token) {
      return {
        status: 401,
        message: 'No token is provided',
      }
    }

    const dbToken = await ACL.findOne({ where: { token } })

    if (!dbToken) {
      return {
        status: 404,
        message: 'Not found',
      }
    }

    await ACL.delete({ id: dbToken.id, token: dbToken.token })

    return {
      status: 200,
      message: 'Successfully deleted token',
    }
  }

  public async validateACL(token: string) {
    const valid = uuid.validate(token)

    if (!valid) {
      return false
    }

    const dbToken = await ACL.findOne({ where: { token } })

    if (!dbToken) {
      return false
    }

    return true
  }
}

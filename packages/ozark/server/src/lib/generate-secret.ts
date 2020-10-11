import * as crypto from 'crypto'

export const generateSecret = () => crypto.randomBytes(100).toString('hex')

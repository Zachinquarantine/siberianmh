import * as express from 'express'

import { getHeathz } from './healtz'

const router = express.Router()

router.get('/-/healtz', getHeathz)

export const apiRoutes = router

import * as express from 'express'

import { handleWebhook } from './repository'
import { bootstrapRoads } from './base'
import { generateACL, deleteACL } from './acl'
import { getAllPullRequests } from './pull-request'
import { requiresAuth } from '../lib/requires-auth'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: ':wave:',
    status: 200,
  })
})

//#region Base API
router.get('/bootstrap', bootstrapRoads)
//#endregion

//#region Tokens
router.post('/acl', requiresAuth, generateACL)
router.delete('/acl/:token', requiresAuth, deleteACL)
//#endregion

//#region Pull Requests
router.get('/pull-request', requiresAuth, getAllPullRequests)
//#endregion

//#region Handle Webhooks
router.post('/gh/handle-event', handleWebhook)
//#endregion

export const apiRoutes = router

import * as express from 'express'

import { handleWebhook } from './repository'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: ':wave:',
    status: 200,
  })
})

router.post('/gh/handle-event', handleWebhook)

export const apiRoutes = router

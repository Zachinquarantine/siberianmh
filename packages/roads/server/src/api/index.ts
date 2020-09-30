import * as express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: ':wave:',
    status: 200,
  })
})

export const apiRoutes = router

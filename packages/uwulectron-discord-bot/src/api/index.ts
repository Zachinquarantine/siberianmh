import * as express from 'express'

const router = express.Router()

// TODO: Add status of the client
router.get('/-/healtz', (req, res) => {
  return res.status(200).json({
    status: 200,
    data: {
      server: true,
    },
  })
})

export const apiRoutes = router

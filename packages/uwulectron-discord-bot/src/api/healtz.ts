import * as express from 'express'

// TODO: Add status of the client
export const getHeathz = (req: express.Request, res: express.Response) => {
  return res.status(200).json({
    status: 200,
    data: {
      server: true,
    },
  })
}

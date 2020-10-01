import 'reflect-metadata'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { connectTypeorm } from './lib/connect-typeorm'

import { apiRoutes } from './api'

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', apiRoutes)

connectTypeorm().then(async () => {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })

  if (process.env.NODE_ENV === 'development') {
    const SmeeClient = await import('smee-client')
    const smee = new SmeeClient({
      source: 'https://smee.io/qB8a2qPBGgIG6SvI',
      target: `http://localhost:${port}/gh/handle-event`,
      logger: console,
    })
    smee.start()
  }
})

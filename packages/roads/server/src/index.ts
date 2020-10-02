if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
import 'reflect-metadata'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { CronJob } from 'cron'

import { connectTypeorm } from './lib/connect-typeorm'
import { apiRoutes } from './api'
import { PullRequestStore } from './lib/store'

const app = express()
const port = process.env.PORT || 5000
const prStore = new PullRequestStore()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', apiRoutes)

connectTypeorm().then(async () => {
  new CronJob('*/5 * * * *', () => {
    prStore.checkPullRequests()
  })

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })

  if (process.env.NODE_ENV === 'development') {
    const SmeeClient = await import('smee-client')
    const smee = new SmeeClient({
      source: `https://smee.io/${process.env.SMEE_CHANNEL}`,
      target: `http://localhost:${port}/api/gh/handle-event`,
      logger: console,
    })
    smee.start()
  }
})

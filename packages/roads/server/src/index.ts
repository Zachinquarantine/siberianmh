if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
import 'reflect-metadata'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { CronJob } from 'cron'

import './lib/validate-config'
import { connectTypeorm } from './lib/connect-typeorm'
import { apiRoutes } from './api'
import { MergeQueueStore } from './lib/store'

const app = express()
const port = process.env.PORT || 5000
const mrQueue = new MergeQueueStore()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.disable('x-powered-by')

app.use('/api', apiRoutes)

connectTypeorm().then(async () => {
  new CronJob('*/5 * * * *', () => {
    mrQueue.mergePullRequests()
  })

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })

  if (process.env.NODE_ENV === 'development') {
    // const ngrokClient = await import('ngrok')
    // const url = await ngrokClient.connect()
    // console.log(`ngrok url: ${url}`)
  }
})

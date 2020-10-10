import 'reflect-metadata'
if (process.env.NODE_ENV === 'development') {
  require('dotenv-safe').config()
}
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as passport from 'passport'
import * as session from 'express-session'
import * as connectRedis from 'connect-redis'
import * as redis from 'redis'

import { ciJobsQueue, notificationsQueue } from './lib/queue'
import { createTypeormConnection } from './lib/connect-typeorm'
import { apiRoutes } from './api'
import { CIStore } from './lib/stores'

const app = express()
const port = process.env.PORT || 5000

const RedisStore = connectRedis(session)
const ciStore = new CIStore()

const redisClient = redis.createClient({
  url: process.env.REDIS_URL ?? undefined,
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    name: 'ozark.session',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 1000 * 60 * 60 * 24 * 9999,
    },
  }),
)

app.use(passport.initialize(), passport.session())

app.use('/api', apiRoutes)

createTypeormConnection().then(() => {
  ciJobsQueue.process(async (job) => {
    ciStore.processJob(job.data)
  })

  notificationsQueue.process(async (job) => {
    ciStore.reportBackManager(job as any)
  })

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
})

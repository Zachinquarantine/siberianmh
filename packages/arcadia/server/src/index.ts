if (process.env.NODE_ENV !== 'development') {
  require('dotenv').config()
}
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { ApolloServer } from 'apollo-server-express'
import * as session from 'express-session'
import * as connectRedis from 'connect-redis'

import { connectTypeorm } from './lib/connect-typeorm'
import { genSchema } from './lib/gen-schema'
import { SESSION_SECRET } from './lib/constants'
import { redis } from './lib/redis'

const app = express()
const RedisStore = connectRedis(session)
const port = 5000

const server = new ApolloServer({
  schema: genSchema(),
  context: ({ req, res }) => ({
    redis,
    req,
    res,
  }),
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
  session({
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    name: 'arcadia_session',
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      maxAge: 1000 * 60 * 60 * 24 * 9999,
    },
  }),
)

server.applyMiddleware({ app, path: '/graphql', cors: false })

connectTypeorm().then(() => {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
})

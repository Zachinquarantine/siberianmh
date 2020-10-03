import * as express from 'express'
import * as bodyParser from 'body-parser'
import { ApolloServer } from 'apollo-server-express'

import { connectTypeorm } from './lib/connect-typeorm'
import { genSchema } from './lib/gen-schema'

const app = express()
const port = 5000

const server = new ApolloServer({
  schema: genSchema(),
  context: ({ req, res }) => ({
    req,
    res,
  }),
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

server.applyMiddleware({ app, path: '/graphql' })

connectTypeorm().then(() => {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
})

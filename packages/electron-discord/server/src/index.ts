import 'reflect-metadata'
import * as express from 'express'

import { connectMySQL } from './lib/connect-mysql'
import { apiRoutes } from './api'

const app = express()
const port = 5000

app.use('/api', apiRoutes)

connectMySQL().then(() => {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
})

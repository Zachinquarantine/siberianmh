import * as express from 'express'
import * as bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

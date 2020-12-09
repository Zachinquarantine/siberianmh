import * as express from 'express'
import { hello } from './meta'

const router = express.Router()

//#region Usage
router.get('/', hello)
//#endregion

export const apiRoutes = router

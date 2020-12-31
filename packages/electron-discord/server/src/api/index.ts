import * as express from 'express'

const router = express.Router()

//#region Imports

// Meta
import { hello } from './meta'

// Help Channels
import { createHelpChannel, getHelpChannel } from './help-chan'
//#endregion

//#region Usage

// Meta
router.get('/', hello)

// Help Channels
router.get('/helpchan/:userId', getHelpChannel)
router.post('/helpchan', createHelpChannel)
//#endregion

export const apiRoutes = router as express.Router

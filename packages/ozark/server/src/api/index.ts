import * as express from 'express'
import * as passport from 'passport'

//#region API Imports
import { handleGitHubCallback } from './auth'

// Users
import { getMe, getRepositoriesForUser } from './user'

// CI
import { handleStatus } from './ci'

// Repository
import {
  getAll,
  createRepository,
  getAllJobsPerRepo,
  getAllStatusesForRepo,
  getRepository,
  updateRepository,
} from './repository'

// Random
import { getZen } from './zen'
//#endregion

const router = express.Router()

//#region API Usage
router.get('/login', passport.authenticate('github'))
router.get('/auth/github/callback', handleGitHubCallback)

// User
router.get('/users/me', getMe)
router.get('/users/gh/repos', getRepositoriesForUser)

// Handlers
router.post('/ci/handle-status', handleStatus)

// Repository
router.get('/repository', getAll)
router.get('/repository/:username/:repo', getRepository)
router.patch('/repository/:repo', updateRepository)
router.post('/repository', createRepository)

// Status
router.get('/status/:username/:repo', getAllJobsPerRepo)
router.get('/status/:username/:repo/status', getAllStatusesForRepo)
// router.get('/repository/:repo/:status', getJobsForStatus)

// Random
router.get('/zen', getZen)
//#endregion

export const apiRoutes = router

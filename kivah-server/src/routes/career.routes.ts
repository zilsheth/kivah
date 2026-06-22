import { Router } from 'express'
import {
  getWorkWins, createWorkWin, deleteWorkWin,
  getSkills, createSkill, updateSkill, deleteSkill,
  getApplications, createApplication, updateApplication, deleteApplication,
  getPrepItems, createPrepItem, updatePrepItem, deletePrepItem
} from '../controllers/career.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()
router.use(protect)

router.get('/wins', getWorkWins)
router.post('/wins', createWorkWin)
router.delete('/wins/:id', deleteWorkWin)

router.get('/skills', getSkills)
router.post('/skills', createSkill)
router.put('/skills/:id', updateSkill)
router.delete('/skills/:id', deleteSkill)

router.get('/applications', getApplications)
router.post('/applications', createApplication)
router.put('/applications/:id', updateApplication)
router.delete('/applications/:id', deleteApplication)

router.get('/prep', getPrepItems)
router.post('/prep', createPrepItem)
router.put('/prep/:id', updatePrepItem)
router.delete('/prep/:id', deletePrepItem)

export default router
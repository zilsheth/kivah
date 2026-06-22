import { Router } from 'express'
import {
  getTrackerFields, createTrackerField, deleteTrackerField,
  getTrackerEntries, createTrackerEntry, updateTrackerEntry, deleteTrackerEntry
} from '../controllers/tracker.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router({ mergeParams: true })
router.use(protect)

router.get('/fields', getTrackerFields)
router.post('/fields', createTrackerField)
router.delete('/fields/:id', deleteTrackerField)

router.get('/entries', getTrackerEntries)
router.post('/entries', createTrackerEntry)
router.put('/entries/:id', updateTrackerEntry)
router.delete('/entries/:id', deleteTrackerEntry)

export default router
import { Router } from 'express'
import { getNote, upsertNote } from '../controllers/note.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router({ mergeParams: true })
router.use(protect)

router.get('/', getNote)
router.put('/', upsertNote)

export default router
import { Router } from 'express'
import {
  getPitches,
  createPitch,
  updatePitch,
  deletePitch
} from '../controllers/pitch.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router({ mergeParams: true })

router.use(protect)

router.get('/', getPitches)
router.post('/', createPitch)
router.put('/:id', updatePitch)
router.delete('/:id', deletePitch)

export default router
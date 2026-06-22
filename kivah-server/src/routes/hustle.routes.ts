import { Router } from 'express'
import {
  getHustles,
  createHustle,
  updateHustle,
  deleteHustle
} from '../controllers/hustle.controller'
import { protect } from '../middleware/auth.middleware'

console.log('Hustle routes loaded ✅')

const router = Router()

// All hustle routes are protected
router.use(protect)

router.get('/', getHustles)
//router.post('/', createHustle)
router.post('/', (req, res, next) => {
  console.log('POST /api/hustles hit ✅')
  next()
}, createHustle)
router.put('/:id', updateHustle)
router.delete('/:id', deleteHustle)

export default router
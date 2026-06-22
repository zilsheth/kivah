import { Router } from 'express'
import { getIncome, createIncome, deleteIncome } from '../controllers/income.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router({ mergeParams: true })
router.use(protect)

router.get('/', getIncome)
router.post('/', createIncome)
router.delete('/:id', deleteIncome)

export default router
import { Router } from 'express'
import { getHomeTasks, createHomeTask, toggleHomeTask, deleteHomeTask } from '../controllers/hometask.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()
router.use(protect)

router.get('/', getHomeTasks)
router.post('/', createHomeTask)
router.patch('/:id/toggle', toggleHomeTask)
router.delete('/:id', deleteHomeTask)

export default router
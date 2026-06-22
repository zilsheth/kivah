import { Router } from 'express'
import { getTasks, createTask, toggleTask, deleteTask } from '../controllers/task.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router({ mergeParams: true })
router.use(protect)

router.get('/', getTasks)
router.post('/', createTask)
router.patch('/:id/toggle', toggleTask)
router.delete('/:id', deleteTask)

export default router
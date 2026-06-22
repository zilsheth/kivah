import { Router } from 'express'
import { getMealPlan, addMeal, deleteMeal, getGroceryList } from '../controllers/mealplan.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()
router.use(protect)

router.get('/', getMealPlan)
router.post('/:mealPlanId/meals', addMeal)
router.delete('/meals/:id', deleteMeal)
router.get('/:mealPlanId/grocery-list', getGroceryList)

export default router
import { Router } from 'express'
import { getRecipes, createRecipe, deleteRecipe } from '../controllers/recipe.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()
router.use(protect)

router.get('/', getRecipes)
router.post('/', createRecipe)
router.delete('/:id', deleteRecipe)

export default router
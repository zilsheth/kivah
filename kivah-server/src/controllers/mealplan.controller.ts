import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { startOfWeek } from 'date-fns'

// ─── GET MEAL PLAN FOR A WEEK ────────────────────────────
export const getMealPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { weekStart } = req.query

    const weekStartDate = weekStart
      ? new Date(weekStart as string)
      : startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday

    let mealPlan = await prisma.mealPlan.findFirst({
      where: { userId, weekStart: weekStartDate },
      include: {
        meals: {
          include: { recipe: { include: { ingredients: true } } }
        }
      }
    })

    // Auto-create the week's plan if it doesn't exist yet
    if (!mealPlan) {
      mealPlan = await prisma.mealPlan.create({
        data: { userId, weekStart: weekStartDate },
        include: {
          meals: {
            include: { recipe: { include: { ingredients: true } } }
          }
        }
      })
    }

    res.json({ mealPlan })
  } catch (error) {
    console.error('GetMealPlan error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── ADD A MEAL TO THE PLAN ───────────────────────────────
export const addMeal = async (req: Request, res: Response) => {
  try {
    const { mealPlanId } = req.params
    const { day, mealType, recipeId, servings } = req.body

    if (!day || !mealType || !recipeId) {
      return res.status(400).json({ message: 'Day, meal type, and recipe are required' })
    }

    const meal = await prisma.meal.create({
      data: {
        day,
        mealType,
        recipeId,
        servings: servings ? parseInt(servings) : 2,
        mealPlanId: mealPlanId as string
      },
      include: { recipe: { include: { ingredients: true } } }
    })

    res.status(201).json({ meal })
  } catch (error) {
    console.error('AddMeal error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── REMOVE A MEAL FROM THE PLAN ─────────────────────────
export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.meal.delete({ where: { id: id as string } })
    res.json({ message: 'Meal removed' })
  } catch (error) {
    console.error('DeleteMeal error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── GENERATE GROCERY LIST FROM MEAL PLAN ────────────────
export const getGroceryList = async (req: Request, res: Response) => {
  try {
    const { mealPlanId } = req.params

    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId as string },
      include: {
        meals: {
          include: { recipe: { include: { ingredients: true } } }
        }
      }
    })

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' })
    }

    // Aggregate all ingredients across all planned meals, grouped by category
    const grouped: Record<string, { name: string; quantities: string[] }[]> = {}

    for (const meal of mealPlan.meals) {
      for (const ingredient of meal.recipe.ingredients) {
        const category = ingredient.category || 'other'
        if (!grouped[category]) grouped[category] = []

        const existing = grouped[category].find(i => i.name.toLowerCase() === ingredient.name.toLowerCase())
        if (existing) {
          if (ingredient.quantity) existing.quantities.push(ingredient.quantity)
        } else {
          grouped[category].push({
            name: ingredient.name,
            quantities: ingredient.quantity ? [ingredient.quantity] : []
          })
        }
      }
    }

    res.json({ groceryList: grouped })
  } catch (error) {
    console.error('GetGroceryList error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}
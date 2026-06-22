import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// ─── GET ALL RECIPES ─────────────────────────────────────
export const getRecipes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const recipes = await prisma.recipe.findMany({
      where: { userId },
      include: { ingredients: true },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ recipes })
  } catch (error) {
    console.error('GetRecipes error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── CREATE RECIPE ───────────────────────────────────────
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { name, cuisine, servings, isFasting, instructions, ingredients } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Recipe name is required' })
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        cuisine,
        servings: servings ? parseInt(servings) : 2,
        isFasting: !!isFasting,
        instructions,
        userId,
        ingredients: {
          create: (ingredients || []).map((ing: any) => ({
            name: ing.name,
            quantity: ing.quantity,
            category: ing.category
          }))
        }
      },
      include: { ingredients: true }
    })

    res.status(201).json({ recipe })
  } catch (error) {
    console.error('CreateRecipe error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ─── DELETE RECIPE ───────────────────────────────────────
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).userId

    const existing = await prisma.recipe.findFirst({
      where: { id: id as string, userId }
    })

    if (!existing) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    await prisma.recipe.delete({ where: { id: id as string } })

    res.json({ message: 'Recipe deleted' })
  } catch (error) {
    console.error('DeleteRecipe error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}
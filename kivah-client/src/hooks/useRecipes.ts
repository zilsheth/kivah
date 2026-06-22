import { useState, useEffect } from 'react'
import api from '../lib/api'
import type { Recipe } from '../types/homebase.types'

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRecipes = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/recipes')
      setRecipes(response.data.recipes)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const createRecipe = async (data: {
    name: string
    cuisine?: string
    servings?: number
    isFasting?: boolean
    instructions?: string
    ingredients: { name: string; quantity?: string; category?: string }[]
  }) => {
    const response = await api.post('/recipes', data)
    setRecipes(prev => [response.data.recipe, ...prev])
    return response.data.recipe
  }

  const deleteRecipe = async (id: string) => {
    await api.delete(`/recipes/${id}`)
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  return { recipes, isLoading, createRecipe, deleteRecipe }
}
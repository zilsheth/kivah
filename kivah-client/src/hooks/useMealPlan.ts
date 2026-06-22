import { useState, useEffect } from 'react'
import api from '../lib/api'
import type { MealPlanData, GroceryList } from '../types/homebase.types'

export function useMealPlan() {
  const [mealPlan, setMealPlan] = useState<MealPlanData | null>(null)
  const [groceryList, setGroceryList] = useState<GroceryList>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchMealPlan = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/mealplans')
      setMealPlan(response.data.mealPlan)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const addMeal = async (day: string, mealType: string, recipeId: string, servings?: number) => {
    if (!mealPlan) return
    const response = await api.post(`/mealplans/${mealPlan.id}/meals`, {
      day, mealType, recipeId, servings
    })
    setMealPlan(prev => prev ? { ...prev, meals: [...prev.meals, response.data.meal] } : prev)
  }

  const deleteMeal = async (id: string) => {
    await api.delete(`/mealplans/meals/${id}`)
    setMealPlan(prev => prev ? { ...prev, meals: prev.meals.filter(m => m.id !== id) } : prev)
  }

  const fetchGroceryList = async () => {
    if (!mealPlan) return
    const response = await api.get(`/mealplans/${mealPlan.id}/grocery-list`)
    setGroceryList(response.data.groceryList)
  }

  useEffect(() => {
    fetchMealPlan()
  }, [])

  return { mealPlan, groceryList, isLoading, addMeal, deleteMeal, fetchGroceryList }
}
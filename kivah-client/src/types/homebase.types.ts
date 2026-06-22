export interface Ingredient {
  id: string
  name: string
  quantity: string | null
  category: string | null
}

export interface Recipe {
  id: string
  name: string
  cuisine: string | null
  servings: number
  isFasting: boolean
  instructions: string | null
  ingredients: Ingredient[]
}

export interface Meal {
  id: string
  day: string
  mealType: string
  servings: number
  mealPlanId: string
  recipeId: string
  recipe: Recipe
}

export interface MealPlanData {
  id: string
  weekStart: string
  meals: Meal[]
}

export interface GroceryItem {
  name: string
  quantities: string[]
}

export type GroceryList = Record<string, GroceryItem[]>

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']
export const CUISINES = ['Gujarati', 'Punjabi', 'South Indian', 'Bengali', 'Maharashtrian', 'Other']
export const CATEGORIES = ['produce', 'dal/grains', 'dairy', 'spices', 'other']
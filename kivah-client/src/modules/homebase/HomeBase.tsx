import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../../hooks/useRecipes'
import { useMealPlan } from '../../hooks/useMealPlan'
import { useHomeTasks } from '../../hooks/useHomeTasks'
import { DAYS, MEAL_TYPES, CUISINES, CATEGORIES } from '../../types/homebase.types'

function HomeBase() {
  const navigate = useNavigate()
  const { recipes, createRecipe, deleteRecipe } = useRecipes()
  const { mealPlan, groceryList, addMeal, deleteMeal, fetchGroceryList } = useMealPlan()
  const { tasks, addTask, toggleTask, deleteTask } = useHomeTasks()

  const [activeTab, setActiveTab] = useState<'plan' | 'recipes' | 'grocery' | 'tasks'>('plan')

  // Recipe form
  const [showRecipeForm, setShowRecipeForm] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const [recipeCuisine, setRecipeCuisine] = useState('')
  const [recipeServings, setRecipeServings] = useState('4')
  const [recipeFasting, setRecipeFasting] = useState(false)
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', category: 'produce' }])

  // Meal assignment form
  const [showMealForm, setShowMealForm] = useState(false)
  const [mealDay, setMealDay] = useState('Monday')
  const [mealType, setMealType] = useState('dinner')
  const [mealRecipeId, setMealRecipeId] = useState('')

  // Task form
  const [newTask, setNewTask] = useState('')

  const handleAddIngredientRow = () => {
    setIngredients(prev => [...prev, { name: '', quantity: '', category: 'produce' }])
  }

  const handleIngredientChange = (index: number, field: string, value: string) => {
    setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing))
  }

  const handleRemoveIngredientRow = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault()
    await createRecipe({
      name: recipeName,
      cuisine: recipeCuisine || undefined,
      servings: parseInt(recipeServings),
      isFasting: recipeFasting,
      ingredients: ingredients.filter(i => i.name.trim() !== '')
    })
    setRecipeName('')
    setRecipeCuisine('')
    setRecipeServings('4')
    setRecipeFasting(false)
    setIngredients([{ name: '', quantity: '', category: 'produce' }])
    setShowRecipeForm(false)
  }

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mealRecipeId) return
    await addMeal(mealDay, mealType, mealRecipeId)
    setShowMealForm(false)
    setMealRecipeId('')
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    await addTask(newTask)
    setNewTask('')
  }

  const handleViewGrocery = async () => {
    await fetchGroceryList()
    setActiveTab('grocery')
  }

  // Group meals by day for the weekly view
  const mealsByDay = DAYS.reduce((acc, day) => {
    acc[day] = mealPlan?.meals.filter(m => m.day === day) || []
    return acc
  }, {} as Record<string, typeof mealPlan extends null ? never[] : any[]>)

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-orange-600 transition text-sm"
            >
              ← Back
            </button>
            <span className="text-2xl">🏠</span>
            <div>
              <h1 className="text-xl font-bold text-orange-700">Home Base</h1>
              <p className="text-xs text-gray-400">Meal planning + household</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-orange-100 p-1 mb-6 w-fit flex-wrap">
          {(['plan', 'recipes', 'grocery', 'tasks'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => tab === 'grocery' ? handleViewGrocery() : setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-orange-600'
              }`}
            >
              {tab === 'plan' ? '📅 Meal Plan' : tab === 'recipes' ? '🍲 Recipes' : tab === 'grocery' ? '🛒 Grocery List' : '✅ Tasks'}
            </button>
          ))}
        </div>

        {/* MEAL PLAN TAB */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">This week's meal plan</p>
              <button
                onClick={() => setShowMealForm(!showMealForm)}
                disabled={recipes.length === 0}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition disabled:opacity-40"
              >
                + Assign Meal
              </button>
            </div>

            {recipes.length === 0 && (
              <p className="text-xs text-orange-400 bg-orange-50 rounded-lg px-4 py-2">
                Add a recipe first before assigning meals to your week.
              </p>
            )}

            {showMealForm && (
              <form onSubmit={handleAddMeal} className="bg-white rounded-xl border border-orange-100 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                <select value={mealDay} onChange={e => setMealDay(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400">
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={mealType} onChange={e => setMealType(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400">
                  {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={mealRecipeId} onChange={e => setMealRecipeId(e.target.value)} required className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400">
                  <option value="">Select recipe</option>
                  {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition">
                  Add
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAYS.map(day => (
                <div key={day} className="bg-white rounded-2xl border border-orange-100 p-4">
                  <h3 className="font-semibold text-orange-700 text-sm mb-3">{day}</h3>
                  {mealsByDay[day]?.length === 0 ? (
                    <p className="text-xs text-gray-300">No meals planned</p>
                  ) : (
                    <div className="space-y-2">
                      {mealsByDay[day]?.map((meal: any) => (
                        <div key={meal.id} className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
                          <div>
                            <p className="text-xs text-gray-400 capitalize">{meal.mealType}</p>
                            <p className="text-sm text-gray-700">{meal.recipe.name}</p>
                          </div>
                          <button onClick={() => deleteMeal(meal.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECIPES TAB */}
        {activeTab === 'recipes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Your personal recipe collection</p>
              <button
                onClick={() => setShowRecipeForm(!showRecipeForm)}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
              >
                + Add Recipe
              </button>
            </div>

            {showRecipeForm && (
              <form onSubmit={handleCreateRecipe} className="bg-white rounded-2xl border border-orange-100 p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={recipeName}
                    onChange={e => setRecipeName(e.target.value)}
                    placeholder="Recipe name"
                    required
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <select value={recipeCuisine} onChange={e => setRecipeCuisine(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400">
                    <option value="">Select cuisine</option>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    value={recipeServings}
                    onChange={e => setRecipeServings(e.target.value)}
                    type="number"
                    placeholder="Servings"
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input type="checkbox" checked={recipeFasting} onChange={e => setRecipeFasting(e.target.checked)} className="accent-orange-600" />
                  Fasting / Ekadashi friendly
                </label>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Ingredients</p>
                  <div className="space-y-2">
                    {ingredients.map((ing, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <input
                          value={ing.name}
                          onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                          placeholder="Ingredient name"
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                        />
                        <input
                          value={ing.quantity}
                          onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
                          placeholder="Quantity (e.g. 1 cup)"
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                        />
                        <select
                          value={ing.category}
                          onChange={e => handleIngredientChange(idx, 'category', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button type="button" onClick={() => handleRemoveIngredientRow(idx)} className="text-xs text-red-400 hover:text-red-600">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={handleAddIngredientRow} className="text-xs text-orange-600 font-medium mt-2 hover:underline">
                    + Add ingredient
                  </button>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition">
                    Save recipe
                  </button>
                  <button type="button" onClick={() => setShowRecipeForm(false)} className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {recipes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No recipes yet — add your first one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="bg-white rounded-2xl border border-orange-100 p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-orange-700">{recipe.name}</h3>
                        <div className="flex gap-2 mt-1">
                          {recipe.cuisine && <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">{recipe.cuisine}</span>}
                          {recipe.isFasting && <span className="text-xs bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full">Fasting</span>}
                          <span className="text-xs text-gray-400">Serves {recipe.servings}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteRecipe(recipe.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {recipe.ingredients.map(ing => (
                        <span key={ing.id} className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full">
                          {ing.name} {ing.quantity && `(${ing.quantity})`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GROCERY LIST TAB */}
        {activeTab === 'grocery' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Auto-generated from this week's meal plan</p>
            {Object.keys(groceryList).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No groceries yet — assign meals to your week first!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(groceryList).map(([category, items]) => (
                  <div key={category} className="bg-white rounded-2xl border border-orange-100 p-5">
                    <h3 className="font-semibold text-orange-700 capitalize mb-3">{category}</h3>
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="checkbox" className="accent-orange-600" />
                          <span className="text-sm text-gray-600">
                            {item.name} {item.quantities.length > 0 && <span className="text-gray-400">({item.quantities.join(', ')})</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <form onSubmit={handleAddTask} className="bg-white rounded-2xl border border-orange-100 p-4 flex gap-3">
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                placeholder="Add a household task..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400 transition"
              />
              <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition">
                Add
              </button>
            </form>

            {tasks.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No household tasks yet!</p>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white rounded-xl border border-orange-100 px-4 py-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 accent-orange-600 cursor-pointer"
                    />
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                    <button onClick={() => deleteTask(task.id)} className="text-xs text-red-400 hover:text-red-600 transition">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeBase
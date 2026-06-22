import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import hustleRoutes from './routes/hustle.routes'
import trackerRoutes from './routes/tracker.routes'
import incomeRoutes from './routes/income.routes'
import noteRoutes from './routes/note.routes'
import taskRoutes from './routes/task.routes'
import recipeRoutes from './routes/recipe.routes'
import mealPlanRoutes from './routes/mealplan.routes'
import homeTaskRoutes from './routes/hometask.routes'
import careerRoutes from './routes/career.routes'
import familyRoutes from './routes/family.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/hustles', hustleRoutes)
app.use('/api/hustles/:hustleId/tracker', trackerRoutes)
app.use('/api/hustles/:hustleId/income', incomeRoutes)
app.use('/api/hustles/:hustleId/note', noteRoutes)
app.use('/api/hustles/:hustleId/tasks', taskRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/mealplans', mealPlanRoutes)
app.use('/api/home-tasks', homeTaskRoutes)
app.use('/api/career', careerRoutes)
app.use('/api/family', familyRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kivah server is running 🚀' })
})

// Catch-all — must be LAST
app.use((req, res) => {
  console.log(`404 - ${req.method} ${req.path}`)
  res.status(404).json({ message: 'Route not found' })
})

const server = app.listen(PORT, () => {
  console.log(`Kivah server running on port ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.stdin.resume()

export default app
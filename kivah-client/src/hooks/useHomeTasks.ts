import { useState, useEffect } from 'react'
import api from '../lib/api'

export interface HomeTask {
  id: string
  title: string
  completed: boolean
  dueDate: string | null
}

export function useHomeTasks() {
  const [tasks, setTasks] = useState<HomeTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/home-tasks')
      setTasks(response.data.tasks)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async (title: string, dueDate?: string) => {
    const response = await api.post('/home-tasks', { title, dueDate })
    setTasks(prev => [response.data.task, ...prev])
  }

  const toggleTask = async (id: string) => {
    const response = await api.patch(`/home-tasks/${id}/toggle`, {})
    setTasks(prev => prev.map(t => t.id === id ? response.data.task : t))
  }

  const deleteTask = async (id: string) => {
    await api.delete(`/home-tasks/${id}`)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return { tasks, isLoading, addTask, toggleTask, deleteTask }
}
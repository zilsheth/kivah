import { useState, useEffect } from 'react'
import api from '../lib/api'

export interface Task {
  id: string
  title: string
  completed: boolean
  dueDate: string | null
  createdAt: string
}

export function useTasks(hustleId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/hustles/${hustleId}/tasks`)
      setTasks(response.data.tasks)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async (title: string, dueDate?: string) => {
    const response = await api.post(`/hustles/${hustleId}/tasks`, { title, dueDate })
    setTasks(prev => [response.data.task, ...prev])
    return response.data.task
  }

  const toggleTask = async (id: string) => {
    const response = await api.patch(`/hustles/${hustleId}/tasks/${id}/toggle`, {})
    setTasks(prev => prev.map(t => t.id === id ? response.data.task : t))
  }

  const deleteTask = async (id: string) => {
    await api.delete(`/hustles/${hustleId}/tasks/${id}`)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    fetchTasks()
  }, [hustleId])

  return { tasks, isLoading, addTask, toggleTask, deleteTask }
}
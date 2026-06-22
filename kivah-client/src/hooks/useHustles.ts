import { useState, useEffect } from 'react'
import api from '../lib/api'
import type { Hustle } from '../types/hustle.types'

export function useHustles() {
  const [hustles, setHustles] = useState<Hustle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHustles = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/hustles')
      setHustles(response.data.hustles)
    } catch (err) {
      setError('Failed to load hustles')
    } finally {
      setIsLoading(false)
    }
  }

  const createHustle = async (data: {
    title: string
    type: string
    monthlyGoal?: number
  }) => {
    const response = await api.post('/hustles', data)
    setHustles(prev => [response.data.hustle, ...prev])
    return response.data.hustle
  }

  const deleteHustle = async (id: string) => {
    await api.delete(`/hustles/${id}`)
    setHustles(prev => prev.filter(h => h.id !== id))
  }

  useEffect(() => {
    fetchHustles()
  }, [])

  return { hustles, isLoading, error, createHustle, deleteHustle, fetchHustles }
}
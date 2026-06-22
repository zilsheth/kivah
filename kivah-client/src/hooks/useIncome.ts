import { useState, useEffect } from 'react'
import api from '../lib/api'

export interface Income {
  id: string
  amount: number
  source: string
  description: string | null
  paymentMethod: string | null
  receivedAt: string
}

export function useIncome(hustleId: string) {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchIncome = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/hustles/${hustleId}/income`)
      setIncomes(response.data.incomes)
      setTotal(response.data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const addIncome = async (data: {
    amount: number
    source: string
    description?: string
    paymentMethod?: string
    receivedAt?: string
  }) => {
    const response = await api.post(`/hustles/${hustleId}/income`, data)
    setIncomes(prev => [response.data.income, ...prev])
    setTotal(prev => prev + response.data.income.amount)
    return response.data.income
  }

  const deleteIncome = async (id: string, amount: number) => {
    await api.delete(`/hustles/${hustleId}/income/${id}`)
    setIncomes(prev => prev.filter(i => i.id !== id))
    setTotal(prev => prev - amount)
  }

  useEffect(() => {
    fetchIncome()
  }, [hustleId])

  return { incomes, total, isLoading, addIncome, deleteIncome }
}
import { useState, useEffect } from 'react'
import api from '../lib/api'
import type { FamilyMember, WellnessLog, FamilyFinance, FamilyPlan } from '../types/family.types'

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/family/members')
      setMembers(response.data.members)
    } finally {
      setIsLoading(false)
    }
  }

  const addMember = async (data: { name: string; relationship: string; dateOfBirth?: string; notes?: string }) => {
    const response = await api.post('/family/members', data)
    setMembers(prev => [...prev, response.data.member])
  }

  const deleteMember = async (id: string) => {
    await api.delete(`/family/members/${id}`)
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  useEffect(() => { fetchMembers() }, [])

  return { members, isLoading, addMember, deleteMember }
}

export function useWellnessLogs() {
  const [logs, setLogs] = useState<WellnessLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/family/wellness')
      setLogs(response.data.logs)
    } finally {
      setIsLoading(false)
    }
  }

  const addLog = async (data: { familyMemberId: string; mood?: string; note?: string }) => {
    const response = await api.post('/family/wellness', data)
    setLogs(prev => [response.data.log, ...prev])
  }

  const deleteLog = async (id: string) => {
    await api.delete(`/family/wellness/${id}`)
    setLogs(prev => prev.filter(l => l.id !== id))
  }

  useEffect(() => { fetchLogs() }, [])

  return { logs, isLoading, addLog, deleteLog }
}

export function useFamilyFinances() {
  const [finances, setFinances] = useState<FamilyFinance[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchFinances = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/family/finances')
      setFinances(response.data.finances)
      setTotalIncome(response.data.totalIncome)
      setTotalExpense(response.data.totalExpense)
      setBalance(response.data.balance)
    } finally {
      setIsLoading(false)
    }
  }

  const addFinance = async (data: {
    type: string; amount: number; category?: string; description?: string; familyMemberId?: string
  }) => {
    const response = await api.post('/family/finances', data)
    setFinances(prev => [response.data.finance, ...prev])
    if (data.type === 'income') setTotalIncome(prev => prev + data.amount)
    else setTotalExpense(prev => prev + data.amount)
    setBalance(prev => data.type === 'income' ? prev + data.amount : prev - data.amount)
  }

  const deleteFinance = async (id: string, type: string, amount: number) => {
    await api.delete(`/family/finances/${id}`)
    setFinances(prev => prev.filter(f => f.id !== id))
    if (type === 'income') setTotalIncome(prev => prev - amount)
    else setTotalExpense(prev => prev - amount)
    setBalance(prev => type === 'income' ? prev - amount : prev + amount)
  }

  useEffect(() => { fetchFinances() }, [])

  return { finances, totalIncome, totalExpense, balance, isLoading, addFinance, deleteFinance }
}

export function useFamilyPlans() {
  const [plans, setPlans] = useState<FamilyPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPlans = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/family/plans')
      setPlans(response.data.plans)
    } finally {
      setIsLoading(false)
    }
  }

  const addPlan = async (title: string, dueDate?: string) => {
    const response = await api.post('/family/plans', { title, dueDate })
    setPlans(prev => [response.data.plan, ...prev])
  }

  const togglePlan = async (id: string) => {
    const response = await api.patch(`/family/plans/${id}/toggle`, {})
    setPlans(prev => prev.map(p => p.id === id ? response.data.plan : p))
  }

  const deletePlan = async (id: string) => {
    await api.delete(`/family/plans/${id}`)
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  useEffect(() => { fetchPlans() }, [])

  return { plans, isLoading, addPlan, togglePlan, deletePlan }
}
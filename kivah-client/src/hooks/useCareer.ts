import { useState, useEffect } from 'react'
import api from '../lib/api'
import type { WorkWin, Skill, JobApplication, PrepItem } from '../types/career.types'

export function useWorkWins() {
  const [wins, setWins] = useState<WorkWin[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchWins = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/career/wins')
      setWins(response.data.wins)
    } finally {
      setIsLoading(false)
    }
  }

  const addWin = async (data: { title: string; description?: string; metric?: string }) => {
    const response = await api.post('/career/wins', data)
    setWins(prev => [response.data.win, ...prev])
  }

  const deleteWin = async (id: string) => {
    await api.delete(`/career/wins/${id}`)
    setWins(prev => prev.filter(w => w.id !== id))
  }

  useEffect(() => { fetchWins() }, [])

  return { wins, isLoading, addWin, deleteWin }
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSkills = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/career/skills')
      setSkills(response.data.skills)
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = async (data: { name: string; category?: string; status?: string }) => {
    const response = await api.post('/career/skills', data)
    setSkills(prev => [response.data.skill, ...prev])
  }

  const updateSkillStatus = async (id: string, status: string) => {
    const response = await api.put(`/career/skills/${id}`, { status })
    setSkills(prev => prev.map(s => s.id === id ? response.data.skill : s))
  }

  const deleteSkill = async (id: string) => {
    await api.delete(`/career/skills/${id}`)
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  useEffect(() => { fetchSkills() }, [])

  return { skills, isLoading, addSkill, updateSkillStatus, deleteSkill }
}

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/career/applications')
      setApplications(response.data.applications)
    } finally {
      setIsLoading(false)
    }
  }

  const addApplication = async (data: {
    company: string; role: string; status?: string; jobUrl?: string; notes?: string
  }) => {
    const response = await api.post('/career/applications', data)
    setApplications(prev => [response.data.application, ...prev])
  }

  const updateApplicationStatus = async (id: string, status: string) => {
    const response = await api.put(`/career/applications/${id}`, { status })
    setApplications(prev => prev.map(a => a.id === id ? response.data.application : a))
  }

  const deleteApplication = async (id: string) => {
    await api.delete(`/career/applications/${id}`)
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  useEffect(() => { fetchApplications() }, [])

  return { applications, isLoading, addApplication, updateApplicationStatus, deleteApplication }
}

export function usePrepItems() {
  const [items, setItems] = useState<PrepItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/career/prep')
      setItems(response.data.items)
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (data: { type: string; title: string; status?: string }) => {
    const response = await api.post('/career/prep', data)
    setItems(prev => [response.data.item, ...prev])
  }

  const updateItemStatus = async (id: string, status: string) => {
    const response = await api.put(`/career/prep/${id}`, { status })
    setItems(prev => prev.map(i => i.id === id ? response.data.item : i))
  }

  const deleteItem = async (id: string) => {
    await api.delete(`/career/prep/${id}`)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  useEffect(() => { fetchItems() }, [])

  return { items, isLoading, addItem, updateItemStatus, deleteItem }
}
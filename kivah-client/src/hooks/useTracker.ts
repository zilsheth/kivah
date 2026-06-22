import { useState, useEffect } from 'react'
import api from '../lib/api'

export interface TrackerField {
  id: string
  name: string
  fieldType: string
  options: string | null
  order: number
}

export interface TrackerEntry {
  id: string
  data: Record<string, any>
  trackerFieldId: string
  createdAt: string
}

export function useTracker(hustleId: string) {
  const [fields, setFields] = useState<TrackerField[]>([])
  const [entries, setEntries] = useState<TrackerEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTracker = async () => {
    try {
      setIsLoading(true)
      const [fieldsRes, entriesRes] = await Promise.all([
        api.get(`/hustles/${hustleId}/tracker/fields`),
        api.get(`/hustles/${hustleId}/tracker/entries`)
      ])
      setFields(fieldsRes.data.fields)
      setEntries(entriesRes.data.entries)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const addField = async (name: string, fieldType: string, options?: string) => {
    const response = await api.post(`/hustles/${hustleId}/tracker/fields`, {
      name, fieldType, options
    })
    setFields(prev => [...prev, response.data.field])
    return response.data.field
  }

  const deleteField = async (id: string) => {
    await api.delete(`/hustles/${hustleId}/tracker/fields/${id}`)
    setFields(prev => prev.filter(f => f.id !== id))
  }

  const addEntry = async (data: Record<string, any>, trackerFieldId: string) => {
    const response = await api.post(`/hustles/${hustleId}/tracker/entries`, {
      data, trackerFieldId
    })
    setEntries(prev => [response.data.entry, ...prev])
    return response.data.entry
  }

  const updateEntry = async (id: string, data: Record<string, any>) => {
    const response = await api.put(`/hustles/${hustleId}/tracker/entries/${id}`, { data })
    setEntries(prev => prev.map(e => e.id === id ? response.data.entry : e))
  }

  const deleteEntry = async (id: string) => {
    await api.delete(`/hustles/${hustleId}/tracker/entries/${id}`)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  useEffect(() => {
    fetchTracker()
  }, [hustleId])

  return { fields, entries, isLoading, addField, deleteField, addEntry, updateEntry, deleteEntry }
}
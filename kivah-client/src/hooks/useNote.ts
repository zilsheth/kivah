import { useState, useEffect } from 'react'
import api from '../lib/api'

export function useNote(hustleId: string) {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const fetchNote = async () => {
    try {
      const response = await api.get(`/hustles/${hustleId}/note`)
      if (response.data.note) {
        setContent(response.data.note.content)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const saveNote = async (text: string) => {
    try {
      setIsSaving(true)
      await api.put(`/hustles/${hustleId}/note`, { content: text })
      setLastSaved(new Date())
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    fetchNote()
  }, [hustleId])

  return { content, setContent, isSaving, lastSaved, saveNote }
}
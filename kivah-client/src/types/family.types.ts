export interface FamilyMember {
  id: string
  name: string
  relationship: string
  dateOfBirth: string | null
  notes: string | null
  _count?: { wellnessLogs: number; finances: number }
}

export interface WellnessLog {
  id: string
  mood: string | null
  note: string | null
  date: string
  familyMemberId: string
}

export interface FamilyFinance {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string | null
  description: string | null
  date: string
  familyMemberId: string | null
  familyMember?: { name: string } | null
}

export interface FamilyPlan {
  id: string
  title: string
  completed: boolean
  dueDate: string | null
}

export const RELATIONSHIPS = ['self', 'spouse', 'child', 'parent', 'in-law', 'sibling', 'other']
export const MOODS = ['great', 'good', 'okay', 'low', 'struggling']
export const FINANCE_CATEGORIES = ['salary', 'side hustle', 'groceries', 'rent', 'utilities', 'education', 'health', 'entertainment', 'other']

export const MOOD_COLORS: Record<string, string> = {
  great: 'bg-green-50 text-green-600',
  good: 'bg-blue-50 text-blue-600',
  okay: 'bg-yellow-50 text-yellow-600',
  low: 'bg-orange-50 text-orange-600',
  struggling: 'bg-red-50 text-red-600'
}
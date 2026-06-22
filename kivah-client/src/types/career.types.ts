export interface WorkWin {
  id: string
  title: string
  description: string | null
  metric: string | null
  date: string
}

export interface Skill {
  id: string
  name: string
  category: string | null
  status: 'learning' | 'practicing' | 'confident'
  notes: string | null
}

export interface JobApplication {
  id: string
  company: string
  role: string
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  appliedDate: string
  followUpDate: string | null
  resumeVersion: string | null
  notes: string | null
  jobUrl: string | null
}

export interface PrepItem {
  id: string
  type: 'dsa' | 'system-design' | 'behavioral'
  title: string
  status: 'struggling' | 'solved' | 'mastered'
  notes: string | null
}

export const APPLICATION_STATUS_COLORS: Record<JobApplication['status'], string> = {
  applied: 'bg-gray-100 text-gray-600',
  screening: 'bg-blue-50 text-blue-600',
  interview: 'bg-purple-50 text-purple-600',
  offer: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-600',
  withdrawn: 'bg-yellow-50 text-yellow-600'
}

export const PREP_STATUS_COLORS: Record<PrepItem['status'], string> = {
  struggling: 'bg-red-50 text-red-600',
  solved: 'bg-blue-50 text-blue-600',
  mastered: 'bg-green-50 text-green-600'
}

export const SKILL_STATUS_COLORS: Record<Skill['status'], string> = {
  learning: 'bg-yellow-50 text-yellow-600',
  practicing: 'bg-blue-50 text-blue-600',
  confident: 'bg-green-50 text-green-600'
}
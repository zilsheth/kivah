export interface Hustle {
  id: string
  title: string
  type: string
  monthlyGoal: number | null
  createdAt: string
  pitches: Pitch[]
  _count: {
    pitches: number
    tasks: number
  }
}

export interface Pitch {
  id: string
  brandName: string
  status: 'draft' | 'sent' | 'replied' | 'negotiating' | 'closed' | 'rejected'
  rate: number | null
  deliverable: string | null
  notes: string | null
  sentAt: string | null
  createdAt: string
  hustleId: string
}

export type PitchStatus = Pitch['status']

export const PITCH_STATUS_COLORS: Record<PitchStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-50 text-blue-600',
  replied: 'bg-yellow-50 text-yellow-600',
  negotiating: 'bg-purple-50 text-purple-600',
  closed: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-600'
}
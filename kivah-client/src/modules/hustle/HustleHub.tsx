import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHustles } from '../../hooks/useHustles'

function HustleHub() {
  const { hustles, isLoading, createHustle, deleteHustle } = useHustles()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [monthlyGoal, setMonthlyGoal] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await createHustle({
        title,
        type,
        monthlyGoal: monthlyGoal ? parseFloat(monthlyGoal) : undefined
      })
      setTitle('')
      setType('')
      setMonthlyGoal('')
      setShowForm(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-kivah-50">
      {/* Header */}
      <div className="bg-white border-b border-kivah-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💼</span>
          <div>
            <h1 className="text-xl font-bold text-kivah-700">Hustle Hub</h1>
            <p className="text-xs text-gray-400">Track your side hustles</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-kivah-600 text-white rounded-lg text-sm font-medium hover:bg-kivah-700 transition"
        >
          + New Hustle
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-kivah-100 p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-kivah-700 mb-4">Add a new hustle</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="UGC Creator, Book Writing..."
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400 transition"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400 transition"
                >
                  <option value="">Select type</option>
                  <option value="UGC">UGC Creator</option>
                  <option value="writing">Writing</option>
                  <option value="tutoring">Tutoring</option>
                  <option value="consulting">Consulting</option>
                  <option value="coaching">Coaching</option>
                  <option value="freelance">Freelance</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Monthly Goal ($)</label>
                <input
                  value={monthlyGoal}
                  onChange={e => setMonthlyGoal(e.target.value)}
                  placeholder="1000"
                  type="number"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400 transition"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-kivah-600 text-white rounded-lg text-sm font-medium hover:bg-kivah-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create hustle'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Hustles list */}
        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading your hustles...</p>
        ) : hustles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">💼</p>
            <p className="text-gray-400">No hustles yet — add your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hustles.map(hustle => (
              <div
                key={hustle.id}
                onClick={() => navigate(`/hustle/${hustle.id}`)}
                className="bg-white rounded-2xl border border-kivah-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-kivah-700 text-lg">{hustle.title}</h3>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      {hustle.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {hustle.monthlyGoal && (
                      <span className="text-sm font-medium text-kivah-600">
                        Goal: ${hustle.monthlyGoal}/mo
                      </span>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        deleteHustle(hustle.id)
                      }}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-gray-400">
                  <span>📋 {hustle._count?.tasks || 0} tasks</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HustleHub
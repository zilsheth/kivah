import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useHustles } from '../../hooks/useHustles'
import { useTasks } from '../../hooks/useTasks'
import { useIncome } from '../../hooks/useIncome'
import { useNote } from '../../hooks/useNote'
import { useTracker } from '../../hooks/useTracker'
import { format } from 'date-fns'

function HustleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hustles } = useHustles()
  const hustle = hustles.find(h => h.id === id)

  const { tasks, addTask, toggleTask, deleteTask } = useTasks(id!)
  const { incomes, total, addIncome, deleteIncome } = useIncome(id!)
  const { content, setContent, isSaving, lastSaved, saveNote } = useNote(id!)
  const { fields, entries, addField, deleteField, addEntry, deleteEntry } = useTracker(id!)

  const [activeTab, setActiveTab] = useState<'tasks' | 'tracker' | 'income' | 'notes'>('tasks')

  // Task form
  const [newTask, setNewTask] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')

  // Income form
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeSource, setIncomeSource] = useState('')
  const [incomeDescription, setIncomeDescription] = useState('')
  const [incomeMethod, setIncomeMethod] = useState('')

  // Tracker — field (column) form
  const [showFieldForm, setShowFieldForm] = useState(false)
  const [fieldName, setFieldName] = useState('')
  const [fieldType, setFieldType] = useState('text')

  // Tracker — entry (row) form
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [entryData, setEntryData] = useState<Record<string, string>>({})

  // Note autosave
  const noteTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleNoteChange = (text: string) => {
    setContent(text)
    if (noteTimeout.current) clearTimeout(noteTimeout.current)
    noteTimeout.current = setTimeout(() => saveNote(text), 1500)
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    await addTask(newTask, taskDueDate || undefined)
    setNewTask('')
    setTaskDueDate('')
  }

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault()
    await addIncome({
      amount: parseFloat(incomeAmount),
      source: incomeSource,
      description: incomeDescription || undefined,
      paymentMethod: incomeMethod || undefined
    })
    setIncomeAmount('')
    setIncomeSource('')
    setIncomeDescription('')
    setIncomeMethod('')
    setShowIncomeForm(false)
  }

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault()
    await addField(fieldName, fieldType)
    setFieldName('')
    setFieldType('text')
    setShowFieldForm(false)
  }

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (fields.length === 0) return
    await addEntry(entryData, fields[0].id)
    setEntryData({})
    setShowEntryForm(false)
  }

  // Goal progress
  const monthlyGoal = hustle?.monthlyGoal || 0
  const progress = monthlyGoal > 0 ? Math.min((total / monthlyGoal) * 100, 100) : 0

  if (!hustle) return (
    <div className="min-h-screen bg-kivah-50 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-kivah-50">
      {/* Header */}
      <div className="bg-white border-b border-kivah-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/hustle')}
              className="text-gray-400 hover:text-kivah-600 transition text-sm"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-kivah-700">{hustle.title}</h1>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{hustle.type}</span>
            </div>
          </div>

          {monthlyGoal > 0 && (
            <div className="hidden md:block w-48">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>${total.toFixed(0)} earned</span>
                <span>Goal: ${monthlyGoal}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-kivah-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-kivah-600 mt-1 text-right font-medium">{progress.toFixed(0)}%</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-kivah-100 p-1 mb-6 w-fit">
          {(['tasks', 'tracker', 'income', 'notes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? 'bg-kivah-600 text-white'
                  : 'text-gray-400 hover:text-kivah-600'
              }`}
            >
              {tab === 'tasks' ? '✅ Tasks' : tab === 'tracker' ? '📊 Tracker' : tab === 'income' ? '💰 Income' : '📝 Notes'}
            </button>
          ))}
        </div>

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <form onSubmit={handleAddTask} className="bg-white rounded-2xl border border-kivah-100 p-4 flex gap-3">
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                placeholder="Add a task..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400 transition"
              />
              <input
                value={taskDueDate}
                onChange={e => setTaskDueDate(e.target.value)}
                type="date"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400 transition"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-kivah-600 text-white rounded-lg text-sm font-medium hover:bg-kivah-700 transition"
              >
                Add
              </button>
            </form>

            {tasks.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No tasks yet — add your first one!</p>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white rounded-xl border border-kivah-100 px-4 py-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 accent-kivah-600 cursor-pointer"
                    />
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-400">
                        {format(new Date(task.dueDate), 'MMM d')}
                      </span>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRACKER TAB */}
        {activeTab === 'tracker' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Define your own columns and track anything.</p>
              <div className="flex gap-2">
                {fields.length > 0 && (
                  <button
                    onClick={() => setShowEntryForm(!showEntryForm)}
                    className="px-3 py-1.5 bg-kivah-600 text-white rounded-lg text-sm font-medium hover:bg-kivah-700 transition"
                  >
                    + Add Row
                  </button>
                )}
                <button
                  onClick={() => setShowFieldForm(!showFieldForm)}
                  className="px-3 py-1.5 border border-kivah-200 text-kivah-600 rounded-lg text-sm font-medium hover:bg-kivah-50 transition"
                >
                  + Add Column
                </button>
              </div>
            </div>

            {showFieldForm && (
              <form onSubmit={handleAddField} className="bg-white rounded-xl border border-kivah-100 p-4 flex gap-3">
                <input
                  value={fieldName}
                  onChange={e => setFieldName(e.target.value)}
                  placeholder="Column name (e.g. Brand, Status, Rate)"
                  required
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400"
                />
                <select
                  value={fieldType}
                  onChange={e => setFieldType(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="status">Status</option>
                  <option value="date">Date</option>
                  <option value="url">URL</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-kivah-600 text-white rounded-lg text-sm font-medium hover:bg-kivah-700 transition">
                  Add
                </button>
              </form>
            )}

            {showEntryForm && fields.length > 0 && (
              <form onSubmit={handleAddEntry} className="bg-white rounded-xl border border-kivah-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {fields.map(field => (
                    <div key={field.id}>
                      <label className="text-xs text-gray-400 mb-1 block">{field.name}</label>
                      <input
                        value={entryData[field.name] || ''}
                        onChange={e => setEntryData(prev => ({ ...prev, [field.name]: e.target.value }))}
                        type={field.fieldType === 'number' ? 'number' : field.fieldType === 'date' ? 'date' : 'text'}
                        placeholder={field.name}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-kivah-600 text-white rounded-lg text-sm font-medium hover:bg-kivah-700 transition">
                    Add row
                  </button>
                  <button type="button" onClick={() => setShowEntryForm(false)} className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {fields.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-kivah-100">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-gray-400 text-sm">No columns yet — add your first one to start tracking!</p>
                <p className="text-gray-300 text-xs mt-1">Example: Brand Name, Platform, Rate, Status</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-kivah-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-kivah-50">
                        {fields.map(field => (
                          <th key={field.id} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                              {field.name}
                              <button
                                onClick={() => deleteField(field.id)}
                                className="text-red-300 hover:text-red-500 transition"
                              >✕</button>
                            </div>
                          </th>
                        ))}
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.length === 0 ? (
                        <tr>
                          <td colSpan={fields.length + 1} className="px-4 py-8 text-center text-gray-300 text-sm">
                            No entries yet — click "Add Row" to create one
                          </td>
                        </tr>
                      ) : (
                        entries.map(entry => (
                          <tr key={entry.id} className="border-b border-kivah-50 hover:bg-kivah-50 transition">
                            {fields.map(field => (
                              <td key={field.id} className="px-4 py-3 text-gray-600">
                                {entry.data[field.name] || '—'}
                              </td>
                            ))}
                            <td className="px-4 py-3">
                              <button
                                onClick={() => deleteEntry(entry.id)}
                                className="text-xs text-red-400 hover:text-red-600"
                              >✕</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INCOME TAB */}
        {activeTab === 'income' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-kivah-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-kivah-700">${total.toFixed(2)}</p>
              </div>
              {monthlyGoal > 0 && (
                <div className="bg-white rounded-2xl border border-kivah-100 p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Monthly Goal</p>
                  <p className="text-2xl font-bold text-kivah-700">${monthlyGoal}</p>
                </div>
              )}
              {monthlyGoal > 0 && (
                <div className="bg-white rounded-2xl border border-kivah-100 p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Progress</p>
                  <p className="text-2xl font-bold text-kivah-700">{progress.toFixed(0)}%</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div className="bg-kivah-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Log every payment you receive.</p>
              <button
                onClick={() => setShowIncomeForm(!showIncomeForm)}
                className="px-3 py-1.5 bg-kivah-600 text-white rounded-lg text-sm font-medium hover:bg-kivah-700 transition"
              >
                + Log Income
              </button>
            </div>

            {showIncomeForm && (
              <form onSubmit={handleAddIncome} className="bg-white rounded-2xl border border-kivah-100 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Amount ($)</label>
                    <input
                      value={incomeAmount}
                      onChange={e => setIncomeAmount(e.target.value)}
                      type="number"
                      placeholder="200"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Source</label>
                    <input
                      value={incomeSource}
                      onChange={e => setIncomeSource(e.target.value)}
                      placeholder="NIVEA, client name..."
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Description</label>
                    <input
                      value={incomeDescription}
                      onChange={e => setIncomeDescription(e.target.value)}
                      placeholder="Gifted collab, invoice..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Payment method</label>
                    <select
                      value={incomeMethod}
                      onChange={e => setIncomeMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-kivah-400"
                    >
                      <option value="">Select...</option>
                      <option value="bank">Bank transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-kivah-600 text-white rounded-lg text-sm font-medium hover:bg-kivah-700 transition">
                    Log income
                  </button>
                  <button type="button" onClick={() => setShowIncomeForm(false)} className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {incomes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No income logged yet.</p>
            ) : (
              <div className="space-y-2">
                {incomes.map(income => (
                  <div key={income.id} className="bg-white rounded-xl border border-kivah-100 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{income.source}</p>
                      {income.description && <p className="text-xs text-gray-400">{income.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-kivah-600">${income.amount}</span>
                      <span className="text-xs text-gray-400">{format(new Date(income.receivedAt), 'MMM d, yyyy')}</span>
                      <button onClick={() => deleteIncome(income.id, income.amount)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-2xl border border-kivah-100 p-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-kivah-700">Brain dump</p>
              <p className="text-xs text-gray-300">
                {isSaving ? 'Saving...' : lastSaved ? `Saved ${format(lastSaved, 'h:mm a')}` : 'Start typing to save'}
              </p>
            </div>
            <textarea
              value={content}
              onChange={e => handleNoteChange(e.target.value)}
              placeholder="Ideas, strategies, contacts, anything... Notes save automatically."
              className="w-full h-64 text-sm text-gray-600 resize-none focus:outline-none placeholder-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default HustleDetail
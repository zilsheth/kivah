import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamilyMembers, useWellnessLogs, useFamilyFinances, useFamilyPlans } from '../../hooks/useFamily'
import { RELATIONSHIPS, MOODS, FINANCE_CATEGORIES, MOOD_COLORS } from '../../types/family.types'
import { format } from 'date-fns'

function FamilySpace() {
  const navigate = useNavigate()
  const { members, addMember, deleteMember } = useFamilyMembers()
  const { logs, addLog, deleteLog } = useWellnessLogs()
  const { finances, totalIncome, totalExpense, balance, addFinance, deleteFinance } = useFamilyFinances()
  const { plans, addPlan, togglePlan, deletePlan } = useFamilyPlans()

  const [activeTab, setActiveTab] = useState<'people' | 'wellness' | 'finances' | 'plans'>('people')

  // Member form
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [memberName, setMemberName] = useState('')
  const [memberRelationship, setMemberRelationship] = useState('')

  // Wellness form
  const [showWellnessForm, setShowWellnessForm] = useState(false)
  const [wellnessMemberId, setWellnessMemberId] = useState('')
  const [wellnessMood, setWellnessMood] = useState('good')
  const [wellnessNote, setWellnessNote] = useState('')

  // Finance form
  const [showFinanceForm, setShowFinanceForm] = useState(false)
  const [financeType, setFinanceType] = useState('income')
  const [financeAmount, setFinanceAmount] = useState('')
  const [financeCategory, setFinanceCategory] = useState('')
  const [financeDescription, setFinanceDescription] = useState('')
  const [financeMemberId, setFinanceMemberId] = useState('')

  // Plan form
  const [newPlan, setNewPlan] = useState('')

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    await addMember({ name: memberName, relationship: memberRelationship })
    setMemberName(''); setMemberRelationship(''); setShowMemberForm(false)
  }

  const handleAddWellness = async (e: React.FormEvent) => {
    e.preventDefault()
    await addLog({ familyMemberId: wellnessMemberId, mood: wellnessMood, note: wellnessNote || undefined })
    setWellnessNote(''); setShowWellnessForm(false)
  }

  const handleAddFinance = async (e: React.FormEvent) => {
    e.preventDefault()
    await addFinance({
      type: financeType,
      amount: parseFloat(financeAmount),
      category: financeCategory || undefined,
      description: financeDescription || undefined,
      familyMemberId: financeMemberId || undefined
    })
    setFinanceAmount(''); setFinanceCategory(''); setFinanceDescription(''); setFinanceMemberId(''); setShowFinanceForm(false)
  }

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlan.trim()) return
    await addPlan(newPlan)
    setNewPlan('')
  }

  const getMemberName = (id: string | null) => members.find(m => m.id === id)?.name || 'Unassigned'

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-pink-600 transition text-sm">← Back</button>
            <span className="text-2xl">👨‍👩‍👧</span>
            <div>
              <h1 className="text-xl font-bold text-pink-700">FamilySpace</h1>
              <p className="text-xs text-gray-400">People, wellness, finances, plans</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-pink-100 p-1 mb-6 w-fit flex-wrap">
          {(['people', 'wellness', 'finances', 'plans'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-pink-600'}`}
            >
              {tab === 'people' ? '👤 People' : tab === 'wellness' ? '🌸 Wellness' : tab === 'finances' ? '💰 Finances' : '📋 Plans'}
            </button>
          ))}
        </div>

        {/* PEOPLE TAB */}
        {activeTab === 'people' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Everyone in your family</p>
              <button onClick={() => setShowMemberForm(!showMemberForm)} className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition">
                + Add Member
              </button>
            </div>

            {showMemberForm && (
              <form onSubmit={handleAddMember} className="bg-white rounded-2xl border border-pink-100 p-4 flex gap-3">
                <input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Name" required className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400" />
                <select value={memberRelationship} onChange={e => setMemberRelationship(e.target.value)} required className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400">
                  <option value="">Relationship</option>
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition">Add</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map(member => (
                <div key={member.id} className="bg-white rounded-2xl border border-pink-100 p-5 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-pink-700">{member.name}</p>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full capitalize">{member.relationship}</span>
                  </div>
                  <button onClick={() => deleteMember(member.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WELLNESS TAB */}
        {activeTab === 'wellness' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Quick check-ins for each family member</p>
              <button
                onClick={() => setShowWellnessForm(!showWellnessForm)}
                disabled={members.length === 0}
                className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition disabled:opacity-40"
              >
                + Log Check-in
              </button>
            </div>

            {members.length === 0 && <p className="text-xs text-pink-400 bg-pink-50 rounded-lg px-4 py-2">Add a family member first.</p>}

            {showWellnessForm && (
              <form onSubmit={handleAddWellness} className="bg-white rounded-2xl border border-pink-100 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <select value={wellnessMemberId} onChange={e => setWellnessMemberId(e.target.value)} required className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400">
                    <option value="">Who?</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <select value={wellnessMood} onChange={e => setWellnessMood(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400">
                    {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <input value={wellnessNote} onChange={e => setWellnessNote(e.target.value)} placeholder="Note (optional)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400" />
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition">Save</button>
                  <button type="button" onClick={() => setShowWellnessForm(false)} className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="bg-white rounded-xl border border-pink-100 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{getMemberName(log.familyMemberId)}</p>
                    {log.note && <p className="text-xs text-gray-400">{log.note}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    {log.mood && <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${MOOD_COLORS[log.mood]}`}>{log.mood}</span>}
                    <span className="text-xs text-gray-300">{format(new Date(log.date), 'MMM d')}</span>
                    <button onClick={() => deleteLog(log.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANCES TAB */}
        {activeTab === 'finances' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-pink-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Income</p>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-pink-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Expenses</p>
                <p className="text-2xl font-bold text-red-500">${totalExpense.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-pink-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-pink-700' : 'text-red-500'}`}>${balance.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Shared family ledger</p>
              <button onClick={() => setShowFinanceForm(!showFinanceForm)} className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition">
                + Add Entry
              </button>
            </div>

            {showFinanceForm && (
              <form onSubmit={handleAddFinance} className="bg-white rounded-2xl border border-pink-100 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <select value={financeType} onChange={e => setFinanceType(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <input value={financeAmount} onChange={e => setFinanceAmount(e.target.value)} type="number" placeholder="Amount" required className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400" />
                  <select value={financeCategory} onChange={e => setFinanceCategory(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400">
                    <option value="">Category</option>
                    {FINANCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={financeMemberId} onChange={e => setFinanceMemberId(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400">
                    <option value="">Assign to (optional)</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <input value={financeDescription} onChange={e => setFinanceDescription(e.target.value)} placeholder="Description (optional)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400" />
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition">Save</button>
                  <button type="button" onClick={() => setShowFinanceForm(false)} className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {finances.map(finance => (
                <div key={finance.id} className="bg-white rounded-xl border border-pink-100 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {finance.description || finance.category || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {finance.familyMember?.name || 'Unassigned'} · {format(new Date(finance.date), 'MMM d')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${finance.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      {finance.type === 'income' ? '+' : '-'}${finance.amount}
                    </span>
                    <button onClick={() => deleteFinance(finance.id, finance.type, finance.amount)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLANS TAB */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <form onSubmit={handleAddPlan} className="bg-white rounded-2xl border border-pink-100 p-4 flex gap-3">
              <input
                value={newPlan}
                onChange={e => setNewPlan(e.target.value)}
                placeholder="Add a shared plan or task..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-pink-400 transition"
              />
              <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition">Add</button>
            </form>

            <div className="space-y-2">
              {plans.map(plan => (
                <div key={plan.id} className="bg-white rounded-xl border border-pink-100 px-4 py-3 flex items-center gap-3">
                  <input type="checkbox" checked={plan.completed} onChange={() => togglePlan(plan.id)} className="w-4 h-4 accent-pink-600 cursor-pointer" />
                  <span className={`flex-1 text-sm ${plan.completed ? 'line-through text-gray-300' : 'text-gray-700'}`}>{plan.title}</span>
                  <button onClick={() => deletePlan(plan.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FamilySpace
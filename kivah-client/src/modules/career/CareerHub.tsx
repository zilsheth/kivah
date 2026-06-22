import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkWins, useSkills, useApplications, usePrepItems } from '../../hooks/useCareer'
import { APPLICATION_STATUS_COLORS, PREP_STATUS_COLORS, SKILL_STATUS_COLORS } from '../../types/career.types'
import { format } from 'date-fns'

function CareerHub() {
  const navigate = useNavigate()
  const { wins, addWin, deleteWin } = useWorkWins()
  const { skills, addSkill, updateSkillStatus, deleteSkill } = useSkills()
  const { applications, addApplication, updateApplicationStatus, deleteApplication } = useApplications()
  const { items, addItem, updateItemStatus, deleteItem } = usePrepItems()

  const [section, setSection] = useState<'myjob' | 'jobsearch'>('myjob')
  const [activeTab, setActiveTab] = useState<'wins' | 'skills' | 'applications' | 'prep'>('wins')

  // Forms state
  const [showWinForm, setShowWinForm] = useState(false)
  const [winTitle, setWinTitle] = useState('')
  const [winDescription, setWinDescription] = useState('')
  const [winMetric, setWinMetric] = useState('')

  const [showSkillForm, setShowSkillForm] = useState(false)
  const [skillName, setSkillName] = useState('')
  const [skillCategory, setSkillCategory] = useState('')

  const [showAppForm, setShowAppForm] = useState(false)
  const [appCompany, setAppCompany] = useState('')
  const [appRole, setAppRole] = useState('')
  const [appUrl, setAppUrl] = useState('')

  const [showPrepForm, setShowPrepForm] = useState(false)
  const [prepType, setPrepType] = useState('dsa')
  const [prepTitle, setPrepTitle] = useState('')

  const handleAddWin = async (e: React.FormEvent) => {
    e.preventDefault()
    await addWin({ title: winTitle, description: winDescription || undefined, metric: winMetric || undefined })
    setWinTitle(''); setWinDescription(''); setWinMetric(''); setShowWinForm(false)
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    await addSkill({ name: skillName, category: skillCategory || undefined })
    setSkillName(''); setSkillCategory(''); setShowSkillForm(false)
  }

  const handleAddApp = async (e: React.FormEvent) => {
    e.preventDefault()
    await addApplication({ company: appCompany, role: appRole, jobUrl: appUrl || undefined })
    setAppCompany(''); setAppRole(''); setAppUrl(''); setShowAppForm(false)
  }

  const handleAddPrep = async (e: React.FormEvent) => {
    e.preventDefault()
    await addItem({ type: prepType, title: prepTitle })
    setPrepTitle(''); setShowPrepForm(false)
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-blue-600 transition text-sm">← Back</button>
            <span className="text-2xl">👩‍💻</span>
            <div>
              <h1 className="text-xl font-bold text-blue-700">Career Hub</h1>
              <p className="text-xs text-gray-400">Current job + job search</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Section toggle */}
        <div className="flex gap-1 bg-white rounded-xl border border-blue-100 p-1 mb-4 w-fit">
          <button
            onClick={() => { setSection('myjob'); setActiveTab('wins') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${section === 'myjob' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600'}`}
          >
            💼 My Job
          </button>
          <button
            onClick={() => { setSection('jobsearch'); setActiveTab('applications') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${section === 'jobsearch' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600'}`}
          >
            🔍 Job Search
          </button>
        </div>

        {/* My Job tabs */}
        {section === 'myjob' && (
          <>
            <div className="flex gap-1 bg-white rounded-xl border border-blue-100 p-1 mb-6 w-fit">
              {(['wins', 'skills'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-blue-600'}`}
                >
                  {tab === 'wins' ? '🏆 Work Wins' : '📚 Skills'}
                </button>
              ))}
            </div>

            {activeTab === 'wins' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Log your achievements as they happen</p>
                  <button onClick={() => setShowWinForm(!showWinForm)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    + Log Win
                  </button>
                </div>

                {showWinForm && (
                  <form onSubmit={handleAddWin} className="bg-white rounded-2xl border border-blue-100 p-4 space-y-3">
                    <input value={winTitle} onChange={e => setWinTitle(e.target.value)} placeholder="What did you achieve?" required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <input value={winDescription} onChange={e => setWinDescription(e.target.value)} placeholder="Description (optional)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <input value={winMetric} onChange={e => setWinMetric(e.target.value)} placeholder="Metric (e.g. reduced load time by 40%)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Save</button>
                      <button type="button" onClick={() => setShowWinForm(false)} className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm">Cancel</button>
                    </div>
                  </form>
                )}

                {wins.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No wins logged yet — start tracking your impact!</p>
                ) : (
                  <div className="space-y-2">
                    {wins.map(win => (
                      <div key={win.id} className="bg-white rounded-xl border border-blue-100 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-700 text-sm">{win.title}</p>
                            {win.description && <p className="text-xs text-gray-400 mt-1">{win.description}</p>}
                            {win.metric && <span className="inline-block mt-2 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{win.metric}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-300">{format(new Date(win.date), 'MMM d')}</span>
                            <button onClick={() => deleteWin(win.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Track what you're learning</p>
                  <button onClick={() => setShowSkillForm(!showSkillForm)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    + Add Skill
                  </button>
                </div>

                {showSkillForm && (
                  <form onSubmit={handleAddSkill} className="bg-white rounded-2xl border border-blue-100 p-4 flex gap-3">
                    <input value={skillName} onChange={e => setSkillName(e.target.value)} placeholder="Skill name" required className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <input value={skillCategory} onChange={e => setSkillCategory(e.target.value)} placeholder="Category" className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Add</button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.map(skill => (
                    <div key={skill.id} className="bg-white rounded-xl border border-blue-100 p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{skill.name}</p>
                        {skill.category && <p className="text-xs text-gray-400">{skill.category}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={skill.status}
                          onChange={e => updateSkillStatus(skill.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${SKILL_STATUS_COLORS[skill.status]}`}
                        >
                          <option value="learning">Learning</option>
                          <option value="practicing">Practicing</option>
                          <option value="confident">Confident</option>
                        </select>
                        <button onClick={() => deleteSkill(skill.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Job Search tabs */}
        {section === 'jobsearch' && (
          <>
            <div className="flex gap-1 bg-white rounded-xl border border-blue-100 p-1 mb-6 w-fit">
              {(['applications', 'prep'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-blue-600'}`}
                >
                  {tab === 'applications' ? '📋 Applications' : '🧠 Prep'}
                </button>
              ))}
            </div>

            {activeTab === 'applications' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Track every application</p>
                  <button onClick={() => setShowAppForm(!showAppForm)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    + Add Application
                  </button>
                </div>

                {showAppForm && (
                  <form onSubmit={handleAddApp} className="bg-white rounded-2xl border border-blue-100 p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input value={appCompany} onChange={e => setAppCompany(e.target.value)} placeholder="Company" required className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <input value={appRole} onChange={e => setAppRole(e.target.value)} placeholder="Role" required className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <input value={appUrl} onChange={e => setAppUrl(e.target.value)} placeholder="Job URL (optional)" className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <div className="md:col-span-3 flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Add</button>
                      <button type="button" onClick={() => setShowAppForm(false)} className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {applications.map(app => (
                    <div key={app.id} className="bg-white rounded-xl border border-blue-100 p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{app.role}</p>
                        <p className="text-xs text-gray-400">{app.company} · Applied {format(new Date(app.appliedDate), 'MMM d')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={app.status}
                          onChange={e => updateApplicationStatus(app.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${APPLICATION_STATUS_COLORS[app.status]}`}
                        >
                          <option value="applied">Applied</option>
                          <option value="screening">Screening</option>
                          <option value="interview">Interview</option>
                          <option value="offer">Offer</option>
                          <option value="rejected">Rejected</option>
                          <option value="withdrawn">Withdrawn</option>
                        </select>
                        <button onClick={() => deleteApplication(app.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prep' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">DSA, system design, behavioral prep</p>
                  <button onClick={() => setShowPrepForm(!showPrepForm)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    + Add Item
                  </button>
                </div>

                {showPrepForm && (
                  <form onSubmit={handleAddPrep} className="bg-white rounded-2xl border border-blue-100 p-4 flex gap-3">
                    <select value={prepType} onChange={e => setPrepType(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400">
                      <option value="dsa">DSA</option>
                      <option value="system-design">System Design</option>
                      <option value="behavioral">Behavioral</option>
                    </select>
                    <input value={prepTitle} onChange={e => setPrepTitle(e.target.value)} placeholder="Topic or problem name" required className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Add</button>
                  </form>
                )}

                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-blue-100 p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{item.title}</p>
                        <p className="text-xs text-gray-400 capitalize">{item.type.replace('-', ' ')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={e => updateItemStatus(item.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${PREP_STATUS_COLORS[item.status]}`}
                        >
                          <option value="struggling">Struggling</option>
                          <option value="solved">Solved</option>
                          <option value="mastered">Mastered</option>
                        </select>
                        <button onClick={() => deleteItem(item.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CareerHub
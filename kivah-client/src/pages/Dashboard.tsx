import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-kivah-50">
      {/* Header */}
      <header className="bg-white border-b border-kivah-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-kivah-700">Kivah</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-kivah-600 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-kivah-700 mb-1">
          {getGreeting()}, {user?.name?.split(' ')[0]} ✨
        </h2>
        <p className="text-gray-400 mb-10">Here's your Kivah overview for today</p>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hustle Hub */}
          <div
            onClick={() => navigate('/hustle')}
            className="bg-white rounded-2xl border border-kivah-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-kivah-100 rounded-xl flex items-center justify-center text-xl">
                💼
              </div>
              <div>
                <h3 className="font-semibold text-kivah-700">Hustle Hub</h3>
                <p className="text-xs text-gray-400">Side hustle tracker</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Track pitches, income, and brand deals in one place.</p>
            <div className="mt-4 text-xs text-kivah-500 font-medium">Open →</div>
          </div>

          {/* Home Base */}
          <div
            onClick={() => navigate('/homebase')}
            className="bg-white rounded-2xl border border-kivah-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                🏠
              </div>
              <div>
                <h3 className="font-semibold text-kivah-700">Home Base</h3>
                <p className="text-xs text-gray-400">Family meal planning</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Plan weekly meals, generate grocery lists, and manage your household.</p>
            <div className="mt-4 text-xs text-kivah-500 font-medium">Open →</div>
          </div>

          {/* Career Hub */}
          <div
            onClick={() => navigate('/career')}
            className="bg-white rounded-2xl border border-kivah-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                👩‍💻
              </div>
              <div>
                <h3 className="font-semibold text-kivah-700">Career Hub</h3>
                <p className="text-xs text-gray-400">Current job + job search</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Log wins, track skills, and manage your job search.</p>
            <div className="mt-4 text-xs text-kivah-500 font-medium">Open →</div>
          </div>

          {/* FamilySpace — coming next */}
          <div 
              onClick={() => navigate('/family')}
              className="bg-white rounded-2xl border border-kivah-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-xl">
                👨‍👩‍👧
              </div>
              <div>
                <h3 className="font-semibold text-kivah-700">FamilySpace</h3>
                <p className="text-xs text-gray-400">Family wellness + finances</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Person-by-person wellness, shared finances, and family plans.</p>
            <div className="mt-4 text-xs text-kivah-500 font-medium">Open →</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
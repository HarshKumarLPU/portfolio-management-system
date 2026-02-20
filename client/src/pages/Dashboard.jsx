import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getStats, getMyPortfolio } from '../services/api'
import AvatarUpload from '../components/AvatarUpload'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, portfolioRes] = await Promise.all([
          getStats(),
          getMyPortfolio(),
        ])
        setStats(statsRes.data.stats)
        setPortfolio(portfolioRes.data.portfolio)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const profileComplete = () => {
    if (!portfolio) return 0
    let score = 0
    if (portfolio.title) score += 20
    if (portfolio.about) score += 20
    if (portfolio.skills?.length > 0) score += 20
    if (portfolio.projects?.length > 0) score += 20
    if (portfolio.experience?.length > 0) score += 10
    if (portfolio.education?.length > 0) score += 10
    return score
  }

  const statsData = [
    { label: 'Profile Views', value: stats?.views ?? 0, icon: '👁️', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' },
    { label: 'Projects Added', value: stats?.projectsCount ?? 0, icon: '🗂️', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600' },
    { label: 'Skills Listed', value: stats?.skillsCount ?? 0, icon: '⚡', color: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600' },
    { label: 'CV Downloads', value: stats?.cvDownloads ?? 0, icon: '📥', color: 'bg-green-50 dark:bg-green-900/30 text-green-600' },
  ]

  const completionItems = [
    { label: 'Add Professional Title', done: !!portfolio?.title },
    { label: 'Write About Me', done: !!portfolio?.about },
    { label: 'Add Skills', done: portfolio?.skills?.length > 0 },
    { label: 'Add Projects', done: portfolio?.projects?.length > 0 },
    { label: 'Add Work Experience', done: portfolio?.experience?.length > 0 },
    { label: 'Add Education', done: portfolio?.education?.length > 0 },
  ]

  const quickLinks = [
    { label: 'Edit Portfolio', path: '/edit-portfolio', icon: '✏️', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'View Portfolio', path: '/portfolio', icon: '🌐', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Public Profile', path: `/profile/${user?.username}`, icon: '🔗', color: 'bg-pink-600 hover:bg-pink-700' },
  ]

  const liveUrl = 'https://portfolio-management-system-woad.vercel.app'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-slate-900 dark:via-gray-900 dark:to-black text-white px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6">
          <AvatarUpload />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-extrabold">Welcome back, {user?.fullName}! 👋</h1>
            <p className="text-indigo-200 text-sm mt-1">@{user?.username} • {user?.email}</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-indigo-200 mb-1">
                <span>Profile Completion</span>
                <span>{profileComplete()}%</span>
              </div>
              <div className="w-64 bg-indigo-400 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileComplete()}%` }}
                />
              </div>
              {profileComplete() < 100 && (
                <p className="text-xs text-indigo-200 mt-1">Complete your profile to attract more recruiters!</p>
              )}
            </div>
          </div>
          <div className="md:ml-auto flex flex-wrap gap-3 justify-center">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`${link.color} text-white text-sm font-semibold px-4 py-2 rounded-full transition flex items-center gap-2`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {statsData.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className={`text-3xl w-12 h-12 flex items-center justify-center rounded-xl mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{stat.value}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two Column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Portfolio Summary */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5">Portfolio Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Skills', value: portfolio?.skills?.length || 0, icon: '⚡' },
                { label: 'Projects', value: portfolio?.projects?.length || 0, icon: '🗂️' },
                { label: 'Experience', value: portfolio?.experience?.length || 0, icon: '💼' },
                { label: 'Education', value: portfolio?.education?.length || 0, icon: '🎓' },
                { label: 'Profile Views', value: portfolio?.views || 0, icon: '👁️' },
                { label: 'CV Downloads', value: portfolio?.cvDownloads || 0, icon: '📥' },
              ].map((item) => (
                <div key={item.label} className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xl font-extrabold text-indigo-600">{item.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/edit-portfolio"
              className="mt-6 w-full bg-indigo-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              ✏️ Edit Your Portfolio
            </Link>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">

            {/* Completion Checklist */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Complete Your Profile</h2>
              <ul className="space-y-3">
                {completionItems.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.done ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                      {item.done ? '✓' : '○'}
                    </span>
                    <span className={item.done ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share Profile */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Share Your Profile 🔗</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Share your public portfolio link with recruiters.</p>
              <div className="bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-xl px-3 py-2 text-xs text-indigo-600 font-medium truncate mb-3">
                {liveUrl}/profile/{user?.username}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(`${liveUrl}/profile/${user?.username}`)}
                className="w-full bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition"
              >
                Copy Link
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
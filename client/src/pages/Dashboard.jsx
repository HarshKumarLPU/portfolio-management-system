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
    { label: 'Profile Views', value: stats?.views ?? 0, icon: '👁️', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Projects Added', value: stats?.projectsCount ?? 0, icon: '🗂️', gradient: 'from-purple-500 to-pink-500' },
    { label: 'Skills Listed', value: stats?.skillsCount ?? 0, icon: '⚡', gradient: 'from-yellow-500 to-orange-500' },
    { label: 'CV Downloads', value: stats?.cvDownloads ?? 0, icon: '📥', gradient: 'from-green-500 to-teal-500' },
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
    { label: 'Edit Portfolio', path: '/edit-portfolio', icon: '✏️', gradient: 'from-indigo-500 to-purple-600' },
    { label: 'View Portfolio', path: '/portfolio', icon: '🌐', gradient: 'from-purple-500 to-pink-600' },
    { label: 'Public Profile', path: `/profile/${user?.username}`, icon: '🔗', gradient: 'from-pink-500 to-rose-500' },
  ]

  const summaryItems = [
    { label: 'Skills', value: portfolio?.skills?.length || 0, icon: '⚡', gradient: 'from-yellow-400 to-orange-500' },
    { label: 'Projects', value: portfolio?.projects?.length || 0, icon: '🗂️', gradient: 'from-purple-500 to-pink-500' },
    { label: 'Experience', value: portfolio?.experience?.length || 0, icon: '💼', gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Education', value: portfolio?.education?.length || 0, icon: '🎓', gradient: 'from-green-500 to-teal-500' },
    { label: 'Profile Views', value: portfolio?.views || 0, icon: '👁️', gradient: 'from-cyan-500 to-blue-500' },
    { label: 'CV Downloads', value: portfolio?.cvDownloads || 0, icon: '📥', gradient: 'from-rose-500 to-pink-500' },
  ]

  const liveUrl = 'https://portfolio-management-system-woad.vercel.app'
  const completion = profileComplete()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── HERO HEADER ── */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950 text-white px-6 py-12 overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

            {/* Avatar */}
            <div className="relative">
              <div className="ring-4 ring-white/30 rounded-full">
                <AvatarUpload />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-2 border-white rounded-full" />
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                <h1 className="text-3xl font-extrabold">Welcome back, {user?.fullName}! 👋</h1>
              </div>
              <p className="text-white/60 text-sm mt-1">@{user?.username} • {user?.email}</p>

              {/* Progress Bar */}
              <div className="mt-5 max-w-sm">
                <div className="flex justify-between text-xs text-white/70 mb-2">
                  <span>Profile Completion</span>
                  <span className="font-bold text-yellow-400">{completion}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-700 shadow-lg"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                {completion < 100 && (
                  <p className="text-xs text-white/50 mt-1.5">
                    🎯 {100 - completion}% left — Complete to attract more recruiters!
                  </p>
                )}
                {completion === 100 && (
                  <p className="text-xs text-green-400 mt-1.5 font-semibold">
                    🎉 Profile complete! You're all set!
                  </p>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`bg-gradient-to-r ${link.gradient} text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg shadow-md`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
              {/* Hover background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-extrabold text-gray-800 dark:text-white">{stat.value}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Portfolio Summary */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-7 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">Portfolio Summary</h2>
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {summaryItems.reduce((a, b) => a + b.value, 0)} total
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="group relative bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.gradient}`} />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xl mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{item.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/edit-portfolio"
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold py-3.5 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.01]"
            >
              ✏️ Edit Your Portfolio
            </Link>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">

            {/* Completion Checklist */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-gray-800 dark:text-white">Complete Profile</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  completion === 100
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                }`}>
                  {completion}%
                </span>
              </div>
              <ul className="space-y-3">
                {completionItems.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm group">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
                      item.done
                        ? 'bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      {item.done ? '✓' : '○'}
                    </span>
                    <span className={`transition-all duration-300 ${
                      item.done
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share Profile */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h2 className="text-lg font-extrabold text-white mb-1">Share Profile 🔗</h2>
                <p className="text-white/60 text-xs mb-4">Share your portfolio with recruiters!</p>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-2 text-xs text-white/80 font-medium truncate mb-3">
                  {liveUrl}/profile/{user?.username}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(`${liveUrl}/profile/${user?.username}`)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-sm font-extrabold py-2.5 rounded-2xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                  📋 Copy Link
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
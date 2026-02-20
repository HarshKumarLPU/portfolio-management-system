import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicPortfolio } from '../services/api'

const PublicProfile = () => {
  const { username } = useParams()
  const [activeTab, setActiveTab] = useState('about')
  const [copied, setCopied] = useState(false)
  const [portfolio, setPortfolio] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await getPublicPortfolio(username)
        setPortfolio(res.data.portfolio)
        setUser(res.data.portfolio.user)
      } catch (error) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [username])

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = ['about', 'skills', 'projects', 'experience', 'education']

  const stats = [
    { label: 'Projects', value: `${portfolio?.projects?.length || 0}+` },
    { label: 'Skills', value: `${portfolio?.skills?.length || 0}+` },
    { label: 'Experience', value: `${portfolio?.experience?.length || 0}` },
    { label: 'Profile Views', value: portfolio?.views || 0 },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400">No portfolio found for @{username}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* ───── HERO ───── */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              🌐 Public Portfolio
            </span>
            <button
              onClick={handleCopy}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full transition"
            >
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>
          </div>

          {/* Profile */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
                alt={user?.fullName}
                className="w-28 h-28 rounded-full border-4 border-white shadow-xl"
              />
              {portfolio?.available && (
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full" />
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl font-extrabold">{user?.fullName}</h1>
                {portfolio?.available && (
                  <span className="bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                    ✅ Open to Work
                  </span>
                )}
              </div>
              <p className="text-indigo-200 text-lg mt-1">{portfolio?.title}</p>
              <p className="text-indigo-300 text-sm mt-1">
                {portfolio?.location && `📍 ${portfolio.location} • `}@{user?.username}
              </p>
              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                {user?.email && (
                  <a href={`mailto:${user.email}`} className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-indigo-50 transition">
                    📧 Email Me
                  </a>
                )}
                {portfolio?.github && (
                  <a href={`https://${portfolio.github}`} target="_blank" rel="noreferrer" className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-indigo-50 transition">
                    🐙 GitHub
                  </a>
                )}
                {portfolio?.linkedin && (
                  <a href={`https://${portfolio.linkedin}`} target="_blank" rel="noreferrer" className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-indigo-50 transition">
                    💼 LinkedIn
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-2xl px-4 py-3 text-center">
                  <p className="text-xl font-extrabold">{stat.value}</p>
                  <p className="text-indigo-200 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ───── TABS ───── */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-16 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-semibold capitalize transition whitespace-nowrap border-b-2 ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-indigo-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ───── TAB CONTENT ───── */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* ABOUT */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About {user?.fullName}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{portfolio?.about || 'No bio added yet.'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[
                { label: 'Location', value: portfolio?.location || '—' },
                { label: 'Email', value: user?.email },
                { label: 'GitHub', value: portfolio?.github || '—' },
                { label: 'LinkedIn', value: portfolio?.linkedin || '—' },
                { label: 'Availability', value: portfolio?.available ? '✅ Open to Work' : '❌ Not Available' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {activeTab === 'skills' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Skills</h2>
            {portfolio?.skills?.length > 0 ? (
              <div className="space-y-5">
                {portfolio.skills.map((skill) => (
                  <div key={skill._id}>
                    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 dark:text-gray-500 py-8">No skills added yet.</p>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Projects</h2>
            {portfolio?.projects?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {portfolio.projects.map((project, index) => {
                  const colors = ['from-indigo-500 to-purple-600', 'from-pink-500 to-rose-600', 'from-green-500 to-teal-600', 'from-yellow-500 to-orange-600']
                  return (
                    <div key={project._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition hover:-translate-y-1 duration-200">
                      <div className={`bg-gradient-to-r ${colors[index % colors.length]} h-3`} />
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{project.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{project.desc}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags?.map((tag) => (
                            <span key={tag} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-3 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noreferrer" className="text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                              🐙 GitHub
                            </a>
                          )}
                          {project.live && (
                            <a href={project.live} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                              🌐 Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400 dark:text-gray-500 py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">No projects added yet.</p>
            )}
          </div>
        )}

        {/* EXPERIENCE */}
        {activeTab === 'experience' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Work Experience</h2>
            {portfolio?.experience?.length > 0 ? (
              <div className="space-y-6">
                {portfolio.experience.map((exp, index) => (
                  <div key={exp._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${exp.current ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      {index !== portfolio.experience.length - 1 && <div className="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-2" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{exp.role}</h3>
                        {exp.current && <span className="bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">Current</span>}
                      </div>
                      <p className="text-indigo-600 font-medium text-sm">{exp.company}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">🗓️ {exp.duration}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 dark:text-gray-500 py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">No experience added yet.</p>
            )}
          </div>
        )}

        {/* EDUCATION */}
        {activeTab === 'education' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Education</h2>
            {portfolio?.education?.length > 0 ? (
              <div className="space-y-6">
                {portfolio.education.map((edu) => (
                  <div key={edu._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🎓</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{edu.degree}</h3>
                        <p className="text-indigo-600 font-medium text-sm">{edu.school}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">🗓️ {edu.duration}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 font-medium">{edu.grade}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 dark:text-gray-500 py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">No education added yet.</p>
            )}
          </div>
        )}

        {/* HIRE ME BANNER */}
        <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-2">Interested in working together? 🤝</h2>
          <p className="text-indigo-200 mb-6">Currently open to new opportunities. Let's build something amazing!</p>
          {user?.email && (
            <a href={`mailto:${user.email}`} className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition inline-block">
              📧 Get In Touch
            </a>
          )}
        </div>

      </div>
    </div>
  )
}

export default PublicProfile
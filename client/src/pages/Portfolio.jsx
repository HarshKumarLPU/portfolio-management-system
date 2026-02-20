import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyPortfolio, downloadCV } from '../services/api'

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await getMyPortfolio()
        setPortfolio(res.data.portfolio)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  const tabs = ['about', 'skills', 'projects', 'experience', 'education']

  // ✅ handleDownloadCV BEFORE loading check — no duplicate if block
  const handleDownloadCV = async () => {
    try {
      const res = await downloadCV()
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${user?.username}-cv.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading CV:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* ───── HERO ───── */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
            alt={user?.fullName}
            className="w-28 h-28 rounded-full border-4 border-white shadow-xl"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-extrabold">{user?.fullName}</h1>
            <p className="text-indigo-200 text-lg mt-1">{portfolio?.title || 'Add your title in Edit Portfolio'}</p>
            <p className="text-indigo-300 text-sm mt-1">
              {portfolio?.location && `📍 ${portfolio.location}`}
            </p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
              {user?.email && (
                <a href={`mailto:${user.email}`} className="bg-white text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-indigo-50 transition">
                  📧 Email
                </a>
              )}
              {portfolio?.github && (
                <a href={`https://${portfolio.github}`} target="_blank" rel="noreferrer" className="bg-white text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-indigo-50 transition">
                  🐙 GitHub
                </a>
              )}
              {portfolio?.linkedin && (
                <a href={`https://${portfolio.linkedin}`} target="_blank" rel="noreferrer" className="bg-white text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-indigo-50 transition">
                  💼 LinkedIn
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/edit-portfolio"
              className="bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-full hover:bg-yellow-300 transition text-sm"
            >
              ✏️ Edit Portfolio
            </Link>
            <button
              onClick={handleDownloadCV}
              className="bg-green-500 text-white font-bold px-6 py-2.5 rounded-full hover:bg-green-600 transition text-sm"
            >
              📥 Download CV
            </button>
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
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About Me</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {portfolio?.about || 'No bio added yet. Go to Edit Portfolio to add your about section.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[
                { label: 'Full Name', value: user?.fullName },
                { label: 'Username', value: `@${user?.username}` },
                { label: 'Location', value: portfolio?.location || '—' },
                { label: 'Email', value: user?.email },
                { label: 'GitHub', value: portfolio?.github || '—' },
                { label: 'LinkedIn', value: portfolio?.linkedin || '—' },
                { label: 'Availability', value: portfolio?.available ? '✅ Open to Work' : '❌ Not Available' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-white mt-0.5">{item.value}</p>
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
                    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-indigo-500 h-3 rounded-full transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 dark:text-gray-500 mb-4">No skills added yet.</p>
                <Link to="/edit-portfolio" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                  + Add Skills
                </Link>
              </div>
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
                  const colors = [
                    'from-indigo-500 to-purple-600',
                    'from-pink-500 to-rose-600',
                    'from-green-500 to-teal-600',
                    'from-yellow-500 to-orange-600',
                  ]
                  return (
                    <div key={project._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition hover:-translate-y-1 duration-200">
                      <div className={`bg-gradient-to-r ${colors[index % colors.length]} h-3`} />
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{project.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{project.desc}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags?.map((tag) => (
                            <span key={tag} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-3 py-1 rounded-full">
                              {tag}
                            </span>
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
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <p className="text-gray-400 dark:text-gray-500 mb-4">No projects added yet.</p>
                <Link to="/edit-portfolio" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                  + Add Projects
                </Link>
              </div>
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
                        {exp.current && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">Current</span>
                        )}
                      </div>
                      <p className="text-indigo-600 font-medium text-sm">{exp.company}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">🗓️ {exp.duration}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <p className="text-gray-400 dark:text-gray-500 mb-4">No experience added yet.</p>
                <Link to="/edit-portfolio" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                  + Add Experience
                </Link>
              </div>
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
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        🎓
                      </div>
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
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <p className="text-gray-400 dark:text-gray-500 mb-4">No education added yet.</p>
                <Link to="/edit-portfolio" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                  + Add Education
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Portfolio
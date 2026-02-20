import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getMyPortfolio,
  updateBasicInfo,
  updateSkills,
  updateProjects,
  updateExperience,
  updateEducation,
} from '../services/api'

const EditPortfolio = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('basic')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const [basic, setBasic] = useState({
    fullName: '', username: '', title: '', location: '',
    email: '', github: '', linkedin: '', about: '',
  })
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [experiences, setExperiences] = useState([])
  const [education, setEducation] = useState([])

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await getMyPortfolio()
        const p = res.data.portfolio
        setBasic({
          fullName: user?.fullName || '',
          username: user?.username || '',
          title: p.title || '',
          location: p.location || '',
          email: user?.email || '',
          github: p.github || '',
          linkedin: p.linkedin || '',
          about: p.about || '',
        })
        setSkills(p.skills || [])
        setProjects(p.projects?.map(proj => ({
          ...proj,
          tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags,
        })) || [])
        setExperiences(p.experience || [])
        setEducation(p.education || [])
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (activeSection === 'basic') {
        await updateBasicInfo({ title: basic.title, location: basic.location, about: basic.about, github: basic.github, linkedin: basic.linkedin })
      } else if (activeSection === 'skills') {
        const cleanSkills = skills.map(({ id, _id, ...rest }) => rest)
        await updateSkills({ skills: cleanSkills })
      } else if (activeSection === 'projects') {
        const cleanProjects = projects.map(({ id, _id, ...rest }) => rest)
        await updateProjects({ projects: cleanProjects })
      } else if (activeSection === 'experience') {
        const cleanExperience = experiences.map(({ id, _id, ...rest }) => rest)
        await updateExperience({ experience: cleanExperience })
      } else if (activeSection === 'education') {
        const cleanEducation = education.map(({ id, _id, ...rest }) => rest)
        await updateEducation({ education: cleanEducation })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateItem = (setter, id, field, value) => {
    setter(prev => prev.map(item => item._id === id || item.id === id ? { ...item, [field]: value } : item))
  }

  const removeItem = (setter, id) => {
    setter(prev => prev.filter(item => item._id !== id && item.id !== id))
  }

  const addSkill = () => setSkills(prev => [...prev, { id: Date.now(), name: '', level: 50 }])
  const addProject = () => setProjects(prev => [...prev, { id: Date.now(), title: '', desc: '', tags: '', github: '', live: '' }])
  const addExperience = () => setExperiences(prev => [...prev, { id: Date.now(), role: '', company: '', duration: '', desc: '', current: false }])
  const addEducation = () => setEducation(prev => [...prev, { id: Date.now(), degree: '', school: '', duration: '', grade: '' }])

  const sections = [
    { key: 'basic', label: 'Basic Info', icon: '👤', gradient: 'from-blue-500 to-indigo-600' },
    { key: 'skills', label: 'Skills', icon: '⚡', gradient: 'from-yellow-500 to-orange-500' },
    { key: 'projects', label: 'Projects', icon: '🗂️', gradient: 'from-purple-500 to-pink-500' },
    { key: 'experience', label: 'Experience', icon: '💼', gradient: 'from-green-500 to-teal-500' },
    { key: 'education', label: 'Education', icon: '🎓', gradient: 'from-pink-500 to-rose-500' },
  ]

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  const activeGradient = sections.find(s => s.key === activeSection)?.gradient || 'from-indigo-500 to-purple-600'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── HERO HEADER ── */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950 text-white px-6 py-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeGradient} flex items-center justify-center text-xl shadow-lg`}>
                {sections.find(s => s.key === activeSection)?.icon}
              </div>
              <h1 className="text-2xl font-extrabold">Edit Portfolio</h1>
            </div>
            <p className="text-white/60 text-sm ml-13">
              Editing: <span className="text-yellow-400 font-bold">{sections.find(s => s.key === activeSection)?.label}</span>
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`font-extrabold px-7 py-3 rounded-2xl transition-all duration-300 text-sm disabled:opacity-60 shadow-lg hover:scale-105 ${
              saved
                ? 'bg-green-400 text-gray-900'
                : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 hover:shadow-yellow-400/30'
            }`}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Saving...
              </span>
            ) : saved ? '✅ Saved!' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">

        {/* ── SIDEBAR ── */}
        <div className="md:w-60 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-4 sticky top-24 border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-3">Sections</p>
            {sections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 mb-1 ${
                  activeSection === sec.key
                    ? `bg-gradient-to-r ${sec.gradient} text-white shadow-md`
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all duration-300 ${
                  activeSection === sec.key
                    ? 'bg-white/20'
                    : `bg-gradient-to-br ${sec.gradient} text-white`
                }`}>
                  {sec.icon}
                </span>
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1">

          {/* BASIC INFO */}
          {activeSection === 'basic' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-md">👤</div>
                <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', field: 'fullName', placeholder: 'John Doe', disabled: true },
                  { label: 'Username', field: 'username', placeholder: 'johndoe', disabled: true },
                  { label: 'Professional Title', field: 'title', placeholder: 'Full Stack Developer' },
                  { label: 'Location', field: 'location', placeholder: 'Mumbai, India' },
                  { label: 'Email', field: 'email', placeholder: 'you@example.com', disabled: true },
                  { label: 'GitHub URL', field: 'github', placeholder: 'github.com/username' },
                  { label: 'LinkedIn URL', field: 'linkedin', placeholder: 'linkedin.com/in/username' },
                ].map((item) => (
                  <div key={item.field}>
                    <label className={labelClass}>{item.label}</label>
                    <input
                      type="text"
                      value={basic[item.field]}
                      onChange={(e) => setBasic({ ...basic, [item.field]: e.target.value })}
                      placeholder={item.placeholder}
                      disabled={item.disabled}
                      className={`${inputClass} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className={labelClass}>About Me</label>
                  <textarea
                    rows={4}
                    value={basic.about}
                    onChange={(e) => setBasic({ ...basic, about: e.target.value })}
                    placeholder="Write a short bio about yourself..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SKILLS */}
          {activeSection === 'skills' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-md">⚡</div>
                  <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">Skills</h2>
                </div>
                <button
                  onClick={addSkill}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-sm font-extrabold px-5 py-2.5 rounded-2xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  + Add Skill
                </button>
              </div>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill._id || skill.id} className="group bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-8 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500" />
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateItem(setSkills, skill._id || skill.id, 'name', e.target.value)}
                        placeholder="Skill name (e.g. React)"
                        className="flex-1 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() => removeItem(setSkills, skill._id || skill.id)}
                        className="w-9 h-9 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300 text-sm flex items-center justify-center hover:scale-110"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => updateItem(setSkills, skill._id || skill.id, 'level', Number(e.target.value))}
                        className="flex-1 accent-orange-500 absolute opacity-0 w-full cursor-pointer"
                        style={{ position: 'relative' }}
                      />
                      <span className="text-sm font-extrabold text-orange-500 w-12 text-right">{skill.level}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateItem(setSkills, skill._id || skill.id, 'level', Number(e.target.value))}
                      className="w-full mt-2 accent-orange-500"
                    />
                  </div>
                ))}
                {skills.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <p className="text-4xl mb-3">⚡</p>
                    <p className="text-gray-400 dark:text-gray-500 font-medium">No skills added yet</p>
                    <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">Click "+ Add Skill" to get started!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {activeSection === 'projects' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md">🗂️</div>
                  <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">Projects</h2>
                </div>
                <button
                  onClick={addProject}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-extrabold px-5 py-2.5 rounded-2xl hover:from-purple-400 hover:to-pink-400 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  + Add Project
                </button>
              </div>
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <div key={project._id || project.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">{project.title || 'New Project'}</h3>
                      </div>
                      <button
                        onClick={() => removeItem(setProjects, project._id || project.id)}
                        className="bg-red-100 dark:bg-red-900/30 text-red-500 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-red-200 transition-all duration-300"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Project Title</label>
                        <input type="text" value={project.title} onChange={(e) => updateItem(setProjects, project._id || project.id, 'title', e.target.value)} placeholder="My Awesome Project" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Tags (comma separated)</label>
                        <input type="text" value={project.tags} onChange={(e) => updateItem(setProjects, project._id || project.id, 'tags', e.target.value)} placeholder="React, Node.js, MongoDB" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>GitHub URL</label>
                        <input type="text" value={project.github} onChange={(e) => updateItem(setProjects, project._id || project.id, 'github', e.target.value)} placeholder="github.com/user/project" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Live Demo URL</label>
                        <input type="text" value={project.live} onChange={(e) => updateItem(setProjects, project._id || project.id, 'live', e.target.value)} placeholder="myproject.vercel.app" className={inputClass} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea rows={3} value={project.desc} onChange={(e) => updateItem(setProjects, project._id || project.id, 'desc', e.target.value)} placeholder="Describe your project..." className={inputClass} />
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <p className="text-4xl mb-3">🗂️</p>
                    <p className="text-gray-400 dark:text-gray-500 font-medium">No projects added yet</p>
                    <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">Click "+ Add Project" to get started!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-xl shadow-md">💼</div>
                  <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">Work Experience</h2>
                </div>
                <button
                  onClick={addExperience}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-extrabold px-5 py-2.5 rounded-2xl hover:from-green-400 hover:to-teal-400 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  + Add Experience
                </button>
              </div>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp._id || exp.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">{exp.role || 'New Experience'}</h3>
                      </div>
                      <button
                        onClick={() => removeItem(setExperiences, exp._id || exp.id)}
                        className="bg-red-100 dark:bg-red-900/30 text-red-500 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-red-200 transition-all duration-300"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Job Role</label>
                        <input type="text" value={exp.role} onChange={(e) => updateItem(setExperiences, exp._id || exp.id, 'role', e.target.value)} placeholder="Full Stack Developer" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Company</label>
                        <input type="text" value={exp.company} onChange={(e) => updateItem(setExperiences, exp._id || exp.id, 'company', e.target.value)} placeholder="TechCorp" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Duration</label>
                        <input type="text" value={exp.duration} onChange={(e) => updateItem(setExperiences, exp._id || exp.id, 'duration', e.target.value)} placeholder="Jan 2023 – Present" className={inputClass} />
                      </div>
                      <div className="flex items-center gap-3 mt-6">
                        <div className={`w-12 h-6 rounded-full transition-all duration-300 cursor-pointer flex items-center px-1 ${exp.current ? 'bg-gradient-to-r from-green-400 to-teal-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                          onClick={() => updateItem(setExperiences, exp._id || exp.id, 'current', !exp.current)}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${exp.current ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <label className="text-sm text-gray-600 dark:text-gray-300 font-medium cursor-pointer"
                          onClick={() => updateItem(setExperiences, exp._id || exp.id, 'current', !exp.current)}
                        >
                          Currently working here
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea rows={3} value={exp.desc} onChange={(e) => updateItem(setExperiences, exp._id || exp.id, 'desc', e.target.value)} placeholder="Describe your role..." className={inputClass} />
                      </div>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <p className="text-4xl mb-3">💼</p>
                    <p className="text-gray-400 dark:text-gray-500 font-medium">No experience added yet</p>
                    <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">Click "+ Add Experience" to get started!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {activeSection === 'education' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-md">🎓</div>
                  <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">Education</h2>
                </div>
                <button
                  onClick={addEducation}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-extrabold px-5 py-2.5 rounded-2xl hover:from-pink-400 hover:to-rose-400 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  + Add Education
                </button>
              </div>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={edu._id || edu.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">{edu.degree || 'New Education'}</h3>
                      </div>
                      <button
                        onClick={() => removeItem(setEducation, edu._id || edu.id)}
                        className="bg-red-100 dark:bg-red-900/30 text-red-500 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-red-200 transition-all duration-300"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Degree / Course</label>
                        <input type="text" value={edu.degree} onChange={(e) => updateItem(setEducation, edu._id || edu.id, 'degree', e.target.value)} placeholder="B.Tech Computer Science" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>School / University</label>
                        <input type="text" value={edu.school} onChange={(e) => updateItem(setEducation, edu._id || edu.id, 'school', e.target.value)} placeholder="Mumbai University" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Duration</label>
                        <input type="text" value={edu.duration} onChange={(e) => updateItem(setEducation, edu._id || edu.id, 'duration', e.target.value)} placeholder="2019 – 2023" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Grade / CGPA</label>
                        <input type="text" value={edu.grade} onChange={(e) => updateItem(setEducation, edu._id || edu.id, 'grade', e.target.value)} placeholder="8.7 CGPA" className={inputClass} />
                      </div>
                    </div>
                  </div>
                ))}
                {education.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <p className="text-4xl mb-3">🎓</p>
                    <p className="text-gray-400 dark:text-gray-500 font-medium">No education added yet</p>
                    <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">Click "+ Add Education" to get started!</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default EditPortfolio
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
        await updateBasicInfo({
          title: basic.title,
          location: basic.location,
          about: basic.about,
          github: basic.github,
          linkedin: basic.linkedin,
        })
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
    { key: 'basic', label: 'Basic Info', icon: '👤' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
    { key: 'projects', label: 'Projects', icon: '🗂️' },
    { key: 'experience', label: 'Experience', icon: '💼' },
    { key: 'education', label: 'Education', icon: '🎓' },
  ]

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"

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

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Edit Portfolio ✏️</h1>
            <p className="text-indigo-200 text-sm mt-1">Keep your portfolio up to date</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-full hover:bg-yellow-300 transition text-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">

        {/* Sidebar */}
        <div className="md:w-56 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-3 sticky top-24">
            {sections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition mb-1 ${
                  activeSection === sec.key
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
                }`}
              >
                <span>{sec.icon}</span>
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">

          {/* BASIC INFO */}
          {activeSection === 'basic' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Basic Information</h2>
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
                      className={`${inputClass} ${item.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Skills</h2>
                <button onClick={addSkill} className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
                  + Add Skill
                </button>
              </div>
              <div className="space-y-5">
                {skills.map((skill) => (
                  <div key={skill._id || skill.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateItem(setSkills, skill._id || skill.id, 'name', e.target.value)}
                        placeholder="Skill name (e.g. React)"
                        className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() => removeItem(setSkills, skill._id || skill.id)}
                        className="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition text-sm flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => updateItem(setSkills, skill._id || skill.id, 'level', Number(e.target.value))}
                        className="flex-1 accent-indigo-600"
                      />
                      <span className="text-sm font-bold text-indigo-600 w-10 text-right">{skill.level}%</span>
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-center text-gray-400 dark:text-gray-500 py-8">No skills added yet. Click "+ Add Skill" to get started!</p>
                )}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {activeSection === 'projects' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Projects</h2>
                <button onClick={addProject} className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
                  + Add Project
                </button>
              </div>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project._id || project.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200">Project Details</h3>
                      <button onClick={() => removeItem(setProjects, project._id || project.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">
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
                  <p className="text-center text-gray-400 dark:text-gray-500 py-8">No projects added yet. Click "+ Add Project" to get started!</p>
                )}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Work Experience</h2>
                <button onClick={addExperience} className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
                  + Add Experience
                </button>
              </div>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp._id || exp.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200">Experience Details</h3>
                      <button onClick={() => removeItem(setExperiences, exp._id || exp.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">
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
                      <div className="flex items-center gap-3 mt-5">
                        <input
                          type="checkbox"
                          id={`current-${exp._id || exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateItem(setExperiences, exp._id || exp.id, 'current', e.target.checked)}
                          className="w-4 h-4 accent-indigo-600"
                        />
                        <label htmlFor={`current-${exp._id || exp.id}`} className="text-sm text-gray-600 dark:text-gray-300 font-medium">
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
                  <p className="text-center text-gray-400 dark:text-gray-500 py-8">No experience added yet. Click "+ Add Experience" to get started!</p>
                )}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {activeSection === 'education' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Education</h2>
                <button onClick={addEducation} className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
                  + Add Education
                </button>
              </div>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu._id || edu.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200">Education Details</h3>
                      <button onClick={() => removeItem(setEducation, edu._id || edu.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">
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
                  <p className="text-center text-gray-400 dark:text-gray-500 py-8">No education added yet. Click "+ Add Education" to get started!</p>
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
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const validatePassword = (password) => {
    if (password.length < 6) return 'Password must be at least 6 characters'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one digit'
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      return
    }
    setLoading(true)
    try {
      await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition"
  const labelClass = "block text-sm font-semibold text-white/80 mb-2"

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 dark:bg-purple-900 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 dark:bg-indigo-900 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-yellow-300 dark:bg-purple-900 rounded-full opacity-10 blur-3xl" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white font-extrabold text-2xl">
            <span className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-2xl">
              PortFolio ✨
            </span>
          </Link>
        </div>

        {/* Glass Card */}
        <div className="bg-white/10 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8">

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              ✨
            </div>
            <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
            <p className="text-white/60 mt-2 text-sm">Start building your portfolio today</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm rounded-2xl px-4 py-3 mb-5 backdrop-blur-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className={inputClass}
              />
            </div>

            {/* Username */}
            <div>
              <label className={labelClass}>Username</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-white/40 text-sm font-bold">@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="johndoe"
                  className="w-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl pl-8 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
                />
              </div>
              <p className="text-xs text-white/30 mt-1">
                Your public profile: /profile/{formData.username || 'username'}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-white/50 hover:text-yellow-400 transition text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1 bg-white/5 border border-white/10 rounded-2xl p-3">
                  {[
                    { label: 'At least 6 characters', valid: formData.password.length >= 6 },
                    { label: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
                    { label: 'One lowercase letter', valid: /[a-z]/.test(formData.password) },
                    { label: 'One digit', valid: /[0-9]/.test(formData.password) },
                    { label: 'One special character (!@#$...)', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) },
                  ].map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2 text-xs">
                      <span className={rule.valid ? 'text-green-400' : 'text-white/30'}>
                        {rule.valid ? '✅' : '○'}
                      </span>
                      <span className={rule.valid ? 'text-green-400' : 'text-white/30'}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                className={inputClass}
              />
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                  {formData.password === formData.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-extrabold py-3.5 rounded-2xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 disabled:opacity-60 shadow-lg hover:shadow-yellow-400/30 hover:scale-[1.02] text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account 🚀'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="mx-3 text-white/40 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Google Button */}
          <button
            onClick={() => window.location.href = 'https://portfolio-management-system-l83z.onrender.com/api/auth/google'}
            className="w-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl py-3 flex items-center justify-center gap-3 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-white/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 font-bold hover:text-yellow-300 transition">
              Login here
            </Link>
          </p>

        </div>

        {/* Bottom tagline */}
        <p className="text-center text-white/30 text-xs mt-6">
          🔒 Secured with JWT Authentication
        </p>

      </div>
    </div>
  )
}

export default Register
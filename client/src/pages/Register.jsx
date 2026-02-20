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
  // ✅ Password validation
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

  const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:bg-gray-900 dark:from-gray-900 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Create Account ✨</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Start building your portfolio today</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className={labelClass}>Username</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400 dark:text-gray-500 text-sm">@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="johndoe"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Your public profile: /profile/{formData.username || 'username'}
              </p>
            </div>

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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition pr-12 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400 hover:text-indigo-500 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                  {[
                    { label: 'At least 6 characters', valid: formData.password.length >= 6 },
                    { label: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
                    { label: 'One lowercase letter', valid: /[a-z]/.test(formData.password) },
                    { label: 'One digit', valid: /[0-9]/.test(formData.password) },
                    { label: 'One special character (!@#$...)', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) },
                  ].map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2 text-xs">
                      <span className={rule.valid ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}>
                        {rule.valid ? '✅' : '○'}
                      </span>
                      <span className={rule.valid ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Create Account 🚀'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="mx-3 text-gray-400 dark:text-gray-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Google Button */}
          <button
            onClick={() => window.location.href = 'https://portfolio-management-system-l83z.onrender.com/api/auth/google'}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register
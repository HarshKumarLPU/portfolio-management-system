import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPasswordApi } from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await forgotPasswordApi({ email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">

          {success ? (
            // Success State
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-3">
                Check Your Email!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                The link expires in 10 minutes.
              </p>
              <Link
                to="/login"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition inline-block text-center"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            // Form State
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">🔑</div>
                <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                  Forgot Password?
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Reset Link 📧'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
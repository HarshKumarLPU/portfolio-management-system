import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMe } from '../services/api'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      // Save token first
      sessionStorage.setItem('token', token)

      // Then fetch user and set in context
      getMe()
        .then((res) => {
          // Manually update auth context by reloading
          window.location.href = '/dashboard'
        })
        .catch((err) => {
          console.error('Auth callback error:', err)
          sessionStorage.removeItem('token')
          navigate('/login')
        })
    } else {
      console.error('No token in callback URL')
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Signing you in with Google...</p>
      </div>
    </div>
  )
}

export default AuthCallback
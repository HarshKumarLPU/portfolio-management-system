import { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, loginUser, logoutUser, getMe } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => sessionStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const register = async (formData) => {
    const res = await registerUser(formData)
    sessionStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const login = async (formData) => {
    const res = await loginUser(formData)
    sessionStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    await logoutUser()
    sessionStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Portfolio', path: '/portfolio' },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
          Port<span className="text-gray-800 dark:text-white">Folio</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">

          {/* Dark Mode Toggle */}
                  <button
                      onClick={toggleDarkMode}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-lg"
                  >
                      {darkMode ? '☀️' : '🌙'}
                  </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                👋 {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white bg-red-500 px-4 py-1.5 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-indigo-600 border border-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium text-white bg-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-700 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-2">
          {/* Dark Mode Toggle Mobile */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 transition text-lg"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Hamburger */}
          <button
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${
                isActive(link.path)
                  ? 'text-indigo-600'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="text-sm text-white bg-red-500 px-4 py-1.5 rounded-full text-center">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-indigo-600 font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-white bg-indigo-600 px-4 py-1.5 rounded-full text-center">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
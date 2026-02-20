import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchPortfolios } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { user } = useAuth()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await searchPortfolios(query)
      setResults(res.data.portfolios)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    if (e.target.value === '') {
      setResults([])
      setSearched(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* ───── HERO ───── */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Discover Portfolios 🔍
          </h1>
          <p className="text-indigo-200 mb-8">
            Search for professionals by name or username
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search by name or username..."
              className="flex-1 px-5 py-3 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition disabled:opacity-60"
            >
              {loading ? '...' : '🔍 Search'}
            </button>
          </form>
        </div>
      </div>

      {/* ───── RESULTS ───── */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Searching...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">😕</p>
            <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-2">No results found</h2>
            <p className="text-gray-400 dark:text-gray-500">Try searching with a different name or username</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Found <span className="font-bold text-indigo-600">{results.length}</span> portfolio{results.length > 1 ? 's' : ''} for "<span className="font-bold">{query}</span>"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((portfolio) => (
                <div
                  key={portfolio._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition hover:-translate-y-1 duration-200 overflow-hidden"
                >
                  {/* Card Top */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-16 relative">
                    <img
                      src={portfolio.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${portfolio.user?.fullName}`}
                      alt={portfolio.user?.fullName}
                      className="w-16 h-16 rounded-full border-4 border-white absolute -bottom-8 left-4 object-cover"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="pt-10 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{portfolio.user?.fullName}</h3>
                        <p className="text-indigo-500 text-sm">@{portfolio.user?.username}</p>
                      </div>
                      {portfolio.available && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                          ✅ Open
                        </span>
                      )}
                    </div>

                    {portfolio.title && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{portfolio.title}</p>
                    )}

                    {portfolio.location && (
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">📍 {portfolio.location}</p>
                    )}

                    {/* Skills Preview */}
                    {portfolio.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {portfolio.skills.slice(0, 3).map((skill) => (
                          <span key={skill._id} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full">
                            {skill.name}
                          </span>
                        ))}
                        {portfolio.skills.length > 3 && (
                          <span className="text-gray-400 dark:text-gray-500 text-xs px-2 py-0.5">
                            +{portfolio.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 mt-4 text-center border-t dark:border-gray-700 pt-4">
                      <div className="flex-1">
                        <p className="font-bold text-gray-700 dark:text-white">{portfolio.projects?.length || 0}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Projects</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-700 dark:text-white">{portfolio.skills?.length || 0}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Skills</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-700 dark:text-white">{portfolio.views || 0}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Views</p>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    {user ? (
                      <Link
                        to={`/profile/${portfolio.user?.username}`}
                        className="mt-4 w-full bg-indigo-600 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center"
                      >
                        View Portfolio 🔗
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="mt-4 w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
                      >
                        🔒 Login to View Profile
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initial State */}
        {!searched && !loading && (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-2">Search for Portfolios</h2>
            <p className="text-gray-400 dark:text-gray-500">Find professionals by their name or username</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Search
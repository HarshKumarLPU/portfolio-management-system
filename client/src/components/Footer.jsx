import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-white text-xl font-bold mb-2">
            Port<span className="text-indigo-400">Folio</span>
          </h2>
          <p className="text-sm">Build, manage and share your professional portfolio & CV with the world.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-indigo-400 transition">Home</Link></li>
            <li><Link to="/search" className="hover:text-indigo-400 transition">Search</Link></li>
            <li><Link to="/portfolio" className="hover:text-indigo-400 transition">Portfolio</Link></li>
            <li><Link to="/dashboard" className="hover:text-indigo-400 transition">Dashboard</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition">Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>📧 support@portfolio.com</li>
            <li>🌐 www.portfolio.com</li>
            <li>📍 India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} PortFolio. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
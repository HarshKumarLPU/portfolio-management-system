import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      icon: '🧑‍💼',
      title: 'Professional Portfolio',
      desc: 'Showcase your projects, skills, and achievements in a clean and modern layout.',
    },
    {
      icon: '📄',
      title: 'CV / Resume Builder',
      desc: 'Create and manage your CV with all your experience, education and certifications.',
    },
    {
      icon: '🔗',
      title: 'Shareable Public Link',
      desc: 'Get a unique public profile link to share with recruiters and clients.',
    },
    {
      icon: '✏️',
      title: 'Easy to Edit',
      desc: 'Update your portfolio anytime from your personal dashboard in just a few clicks.',
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      desc: 'Your portfolio looks great on all devices — desktop, tablet and mobile.',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      desc: 'Your data is protected with JWT authentication and secure API endpoints.',
    },
  ]

  const steps = [
    { step: '01', title: 'Create Account', desc: 'Sign up for free in seconds.' },
    { step: '02', title: 'Fill Your Details', desc: 'Add skills, projects, experience & education.' },
    { step: '03', title: 'Publish & Share', desc: 'Go live and share your unique portfolio link.' },
  ]

  return (
    <div className="font-sans">

      {/* ───── HERO SECTION ───── */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-white text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">
            Your Career. Your Story.
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Build Your Dream <br />
            <span className="text-yellow-300">Portfolio & CV</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Create a stunning professional portfolio, manage your CV and share it with the world — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition text-lg"
            >
              Get Started Free 🚀
            </Link>
            <Link
              to="/portfolio"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-indigo-600 transition text-lg"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ───── STATS SECTION ───── */}
      <section className="bg-indigo-50 dark:bg-indigo-900/20 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: '10K+', label: 'Users' },
            { number: '25K+', label: 'Portfolios Created' },
            { number: '500+', label: 'Companies Reached' },
            { number: '98%', label: 'Satisfaction Rate' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-indigo-600">{stat.number}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FEATURES SECTION ───── */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Everything You Need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              All the tools to build, manage and share your professional identity online.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-6 hover:shadow-lg transition hover:-translate-y-1 duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-14">Get your portfolio live in 3 simple steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                <div className="text-5xl font-extrabold text-indigo-100 dark:text-indigo-900 mb-2">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA SECTION ───── */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to Stand Out? 🌟
        </h2>
        <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-lg">
          Join thousands of professionals who already use PortFolio to land their dream jobs.
        </p>
        <Link
          to="/register"
          className="bg-yellow-400 text-gray-900 font-bold px-10 py-3 rounded-full hover:bg-yellow-300 transition text-lg"
        >
          Create Your Portfolio Now
        </Link>
      </section>

    </div>
  )
}

export default Home
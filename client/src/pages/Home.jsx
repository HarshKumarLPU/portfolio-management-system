import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    { icon: '🧑‍💼', title: 'Professional Portfolio', desc: 'Showcase your projects, skills, and achievements in a clean and modern layout.' },
    { icon: '📄', title: 'CV / Resume Builder', desc: 'Create and manage your CV with all your experience, education and certifications.' },
    { icon: '🔗', title: 'Shareable Public Link', desc: 'Get a unique public profile link to share with recruiters and clients.' },
    { icon: '✏️', title: 'Easy to Edit', desc: 'Update your portfolio anytime from your personal dashboard in just a few clicks.' },
    { icon: '📱', title: 'Mobile Responsive', desc: 'Your portfolio looks great on all devices — desktop, tablet and mobile.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected with JWT authentication and secure API endpoints.' },
  ]

  const steps = [
    { step: '01', title: 'Create Account', desc: 'Sign up for free in seconds.', icon: '🚀', color: 'from-indigo-500 to-blue-600' },
    { step: '02', title: 'Fill Your Details', desc: 'Add skills, projects, experience & education.', icon: '✏️', color: 'from-purple-500 to-pink-600' },
    { step: '03', title: 'Publish & Share', desc: 'Go live and share your unique portfolio link.', icon: '🌐', color: 'from-yellow-500 to-orange-500' },
  ]

  const featureGradients = [
    'from-indigo-500 to-purple-600',
    'from-pink-500 to-rose-500',
    'from-blue-500 to-cyan-500',
    'from-yellow-500 to-orange-500',
    'from-green-500 to-teal-500',
    'from-purple-500 to-indigo-600',
  ]

  return (
    <div className="font-sans overflow-x-hidden">

      {/* ───── HERO SECTION ───── */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 dark:from-slate-900 dark:via-purple-950 dark:to-indigo-950 text-white py-32 px-4 overflow-hidden">

        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 dark:bg-purple-900 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 dark:bg-indigo-900 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300 dark:bg-purple-800 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest mb-8 inline-block">
            ✨ Your Career. Your Story.
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Build Your Dream <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Portfolio & CV
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create a stunning professional portfolio, manage your CV and share it with the world — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group relative bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-10 py-4 rounded-full hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 text-lg shadow-lg hover:shadow-yellow-400/50 hover:scale-105"
            >
              Get Started Free 🚀
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition" />
            </Link>
            <Link
              to="/search"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-10 py-4 rounded-full hover:bg-white/20 transition-all duration-300 text-lg hover:scale-105"
            >
              View Demo 👀
            </Link>
          </div>

          {/* Floating cards preview */}
          <div className="mt-16 flex justify-center gap-4 flex-wrap">
            {['React', 'Node.js', 'MongoDB', 'Tailwind', 'Express'].map((tech, i) => (
              <span
                key={tech}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── STATS SECTION ───── */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-14 px-4">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          {[
            { number: '10K+', label: 'Users', icon: '👥' },
            { number: '25K+', label: 'Portfolios Created', icon: '🗂️' },
            { number: '500+', label: 'Companies Reached', icon: '🏢' },
            { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <p className="text-4xl font-extrabold text-white group-hover:text-yellow-300 transition-colors duration-300">{stat.number}</p>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FEATURES SECTION ───── */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm font-bold uppercase tracking-widest">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mt-2">
              Everything You Need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto text-lg">
              All the tools to build, manage and share your professional identity online.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${featureGradients[index]}`} />

                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${featureGradients[index]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className={`text-4xl w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${featureGradients[index]} mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="bg-white/20 text-white text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full inline-block mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            How It Works
          </h2>
          <p className="text-white/70 mb-16 text-lg">Get your portfolio live in 3 simple steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-white/20" />

            {steps.map((item, index) => (
              <div key={item.step} className="group relative">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="text-6xl font-extrabold text-white/10 absolute top-4 right-6">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIAL STRIP ───── */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            🌟 Trusted by <span className="underline decoration-wavy decoration-white/50">10,000+</span> professionals worldwide
          </p>
          <p className="text-gray-800/70 dark:text-gray-400 mt-3 text-lg">
            From fresh graduates to senior engineers — everyone deserves a great portfolio.
          </p>
        </div>
      </section>

      {/* ───── CTA SECTION ───── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white py-28 px-4 text-center overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse" />

        <div className="relative z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent text-sm font-bold uppercase tracking-widest block mb-4">
            Get Started Today
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Ready to Stand Out? 🌟
          </h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            Join thousands of professionals who already use PortFolio to land their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-extrabold px-12 py-4 rounded-full hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 text-xl shadow-2xl hover:shadow-yellow-400/30 hover:scale-105"
            >
              Create Your Portfolio Now ✨
            </Link>
            <Link
              to="/login"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold px-12 py-4 rounded-full hover:bg-white/20 transition-all duration-300 text-xl hover:scale-105"
            >
              Login →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
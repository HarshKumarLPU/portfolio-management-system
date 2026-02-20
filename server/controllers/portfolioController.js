import Portfolio from '../models/Portfolio.js'
import User from '../models/User.js'

// ────────────────────────────
// @route  GET /api/portfolio/me
// @access Private
// ────────────────────────────
export const getMyPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id })

    if (!portfolio) {
      portfolio = await Portfolio.create({ user: req.user._id })
    }

    res.status(200).json({ success: true, portfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  GET /api/portfolio/:username
// @access Public
// ────────────────────────────
export const getPublicPortfolio = async (req, res) => {
  try {
    const { username } = req.params

    // First find the user by username
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    // Then find their portfolio
    const portfolio = await Portfolio.findOne({ user: user._id })
      .populate('user', 'fullName username email avatar')

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found',
      })
    }

    // Increment views
    portfolio.views += 1
    await portfolio.save()

    res.status(200).json({ success: true, portfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  PUT /api/portfolio/basic
// @access Private
// ────────────────────────────
export const updateBasicInfo = async (req, res) => {
  try {
    const { title, location, about, github, linkedin, website, available } = req.body

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { title, location, about, github, linkedin, website, available },
      { new: true, upsert: true }
    )

    res.status(200).json({ success: true, portfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  PUT /api/portfolio/skills
// @access Private
// ────────────────────────────
export const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { skills },
      { new: true, upsert: true }
    )

    res.status(200).json({ success: true, portfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  PUT /api/portfolio/projects
// @access Private
// ────────────────────────────
export const updateProjects = async (req, res) => {
  try {
    const { projects } = req.body

    // Convert tags string to array if needed
    const formattedProjects = projects.map((p) => ({
      ...p,
      tags: typeof p.tags === 'string'
        ? p.tags.split(',').map((t) => t.trim())
        : p.tags,
    }))

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { projects: formattedProjects },
      { new: true, upsert: true }
    )

    res.status(200).json({ success: true, portfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  PUT /api/portfolio/experience
// @access Private
// ────────────────────────────
export const updateExperience = async (req, res) => {
  try {
    const { experience } = req.body

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { experience },
      { new: true, upsert: true }
    )

    res.status(200).json({ success: true, portfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  PUT /api/portfolio/education
// @access Private
// ────────────────────────────
export const updateEducation = async (req, res) => {
  try {
    const { education } = req.body

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { education },
      { new: true, upsert: true }
    )

    res.status(200).json({ success: true, portfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  DELETE /api/portfolio
// @access Private
// ────────────────────────────
export const deletePortfolio = async (req, res) => {
  try {
    await Portfolio.findOneAndDelete({ user: req.user._id })

    res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  GET /api/portfolio/stats
// @access Private
// ────────────────────────────
export const getStats = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id })

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' })
    }

    const stats = {
      views: portfolio.views,
      cvDownloads: portfolio.cvDownloads,
      projectsCount: portfolio.projects.length,
      skillsCount: portfolio.skills.length,
      experienceCount: portfolio.experience.length,
      educationCount: portfolio.education.length,
    }

    res.status(200).json({ success: true, stats })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
// ────────────────────────────
// @route  GET /api/portfolio/search/users?q=keyword
// @access Public
// ────────────────────────────
export const searchPortfolios = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    // Find users matching the search query
    const users = await User.find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
      ],
    }).select('fullName username avatar')

    // Get portfolios for those users
    const userIds = users.map((u) => u._id)
    const portfolios = await Portfolio.find({
      user: { $in: userIds },
    }).populate('user', 'fullName username avatar')

    res.status(200).json({ success: true, portfolios })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
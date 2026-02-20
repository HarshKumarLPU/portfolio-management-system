import express from 'express'
import {
  getMyPortfolio,
  getPublicPortfolio,
  updateBasicInfo,
  updateSkills,
  updateProjects,
  updateExperience,
  updateEducation,
  deletePortfolio,
  getStats,
  searchPortfolios,
} from '../controllers/portfolioController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Private routes
router.get('/me', protect, getMyPortfolio)
router.get('/stats', protect, getStats)
router.put('/basic', protect, updateBasicInfo)
router.put('/skills', protect, updateSkills)
router.put('/projects', protect, updateProjects)
router.put('/experience', protect, updateExperience)
router.put('/education', protect, updateEducation)
router.delete('/', protect, deletePortfolio)
router.get('/search/users', searchPortfolios)

// Public route
router.get('/:username', getPublicPortfolio)

export default router
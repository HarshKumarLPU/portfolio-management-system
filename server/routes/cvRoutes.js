import express from 'express'
import { generateCV } from '../controllers/cvController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/download', protect, generateCV)

export default router
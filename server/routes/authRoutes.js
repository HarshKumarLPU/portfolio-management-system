import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import {
  register, login, logout, getMe, updateProfile, changePassword, forgotPassword, resetPassword 
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    })

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
  }
)

// Private routes
router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.put('/update', protect, updateProfile)
router.put('/change-password', protect, changePassword)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

export default router
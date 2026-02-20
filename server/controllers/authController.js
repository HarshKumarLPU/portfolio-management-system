import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Portfolio from '../models/Portfolio.js'
import crypto from 'crypto'
import { sendResetEmail } from '../config/email.js'

// ── Generate Token ──
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// ── Send Token in Cookie ──
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id)

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  res.cookie('token', token, cookieOptions)

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
  })
}

// ────────────────────────────
// @route  POST /api/auth/register
// @access Public
// ────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { fullName, username, email, password } = req.body

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters and contain uppercase, lowercase, digit and special character',
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? 'Email already registered'
          : 'Username already taken',
      })
    }

    // Create user
    const user = await User.create({ fullName, username, email, password })

    // Auto create empty portfolio for new user
    await Portfolio.create({ user: user._id })

    sendTokenResponse(user, 201, res)
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────
// @route  POST /api/auth/login
// @access Public
// ────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────
// @route  POST /api/auth/logout
// @access Private
// ────────────────────────────
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}

// ────────────────────────────
// @route  GET /api/auth/me
// @access Private
// ────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────
// @route  PUT /api/auth/update
// @access Private
// ────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, avatar } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email, avatar },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────
// @route  PUT /api/auth/change-password
// @access Private
// ────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id).select('+password')

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
// ────────────────────────────
// @route  POST /api/auth/forgot-password
// @access Public
// ────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Hash token and save to database
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Token expires in 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    await user.save()

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    // Send email
    await sendResetEmail(user.email, resetUrl)

    res.status(200).json({
      success: true,
      message: 'Password reset email sent!',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ────────────────────────────
// @route  POST /api/auth/reset-password/:token
// @access Public
// ────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // Hash the token from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link',
      })
    }

    // Set new password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now login.',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
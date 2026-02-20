import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js'
import cvRoutes from './routes/cvRoutes.js' 
import uploadRoutes from './routes/uploadRoutes.js'
import passport from 'passport'
import './config/passport.js'

dotenv.config()
connectDB()

const app = express()

// ── Middleware ──
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      process.env.CLIENT_URL,
    ]
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

// ── Routes ──
app.use('/api/auth', authRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/cv', cvRoutes)
app.use('/api/upload', uploadRoutes)

// ── Health Check ──
app.get('/', (req, res) => {
  res.json({ message: '🚀 Portfolio API is running!' })
})

// ── Error Handler ──
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

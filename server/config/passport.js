import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'
import Portfolio from '../models/Portfolio.js'
import dotenv from 'dotenv'

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value })

        if (user) {
          // Update avatar if changed
          if (profile.photos[0].value) {
            user.avatar = profile.photos[0].value
            await user.save()
          }
          return done(null, user)
        }

        // Create username from display name
        const baseUsername = profile.displayName.toLowerCase().replace(/\s+/g, '')
        let username = baseUsername
        let count = 1

        // Make sure username is unique
        while (await User.findOne({ username })) {
          username = `${baseUsername}${count}`
          count++
        }

        // Create new user
        user = await User.create({
          fullName: profile.displayName,
          username,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value || '',
          password: Math.random().toString(36).slice(-8) + 'Aa1!',
        })

        // Create empty portfolio
        await Portfolio.create({ user: user._id })

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

export default passport
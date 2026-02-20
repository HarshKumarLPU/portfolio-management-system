import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 50 },
})

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  tags: [{ type: String }],
  github: { type: String, default: '' },
  live: { type: String, default: '' },
})

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String },
  desc: { type: String },
  current: { type: Boolean, default: false },
})

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  school: { type: String, required: true },
  duration: { type: String },
  grade: { type: String },
})

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    available: {
      type: Boolean,
      default: true,
    },
    skills: [skillSchema],
    projects: [projectSchema],
    experience: [experienceSchema],
    education: [educationSchema],
    views: {
      type: Number,
      default: 0,
    },
    cvDownloads: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Portfolio = mongoose.model('Portfolio', portfolioSchema)
export default Portfolio
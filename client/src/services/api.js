import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
})

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const logoutUser = () => API.post('/auth/logout')
export const getMe = () => API.get('/auth/me')
export const updateProfile = (data) => API.put('/auth/update', data)
export const changePassword = (data) => API.put('/auth/change-password', data)
export const downloadCV = () => API.get('/cv/download', { responseType: 'blob' })
export const uploadAvatar = (formData) => API.post('/upload/avatar', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const searchPortfolios = (query) => API.get(`/portfolio/search/users?q=${query}`)
export const forgotPasswordApi = (data) => API.post('/auth/forgot-password', data)
export const resetPasswordApi = (token, data) => API.post(`/auth/reset-password/${token}`, data)
// Portfolio
export const getMyPortfolio = () => API.get('/portfolio/me')
export const getPublicPortfolio = (username) => API.get(`/portfolio/${username}`)
export const getStats = () => API.get('/portfolio/stats')
export const updateBasicInfo = (data) => API.put('/portfolio/basic', data)
export const updateSkills = (data) => API.put('/portfolio/skills', data)
export const updateProjects = (data) => API.put('/portfolio/projects', data)
export const updateExperience = (data) => API.put('/portfolio/experience', data)
export const updateEducation = (data) => API.put('/portfolio/education', data)
export const deletePortfolio = () => API.delete('/portfolio')


export default API
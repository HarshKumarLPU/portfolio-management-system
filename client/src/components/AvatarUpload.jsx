import { useState, useRef } from 'react'
import { uploadAvatar } from '../services/api'
import { useAuth } from '../context/AuthContext'

const AvatarUpload = () => {
  const { user, login } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await uploadAvatar(formData)

      // Update user avatar in context
      const token = localStorage.getItem('token')
      if (token) {
        window.location.reload() // Reload to refresh user data
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Avatar Preview */}
      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <img
          src={preview || user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
          alt="Avatar"
          className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover"
        />
        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span className="text-white text-xs font-bold">📷 Change</span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Upload Button — only show after file selected */}
      {preview && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-indigo-50 transition disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : success ? '✅ Uploaded!' : '⬆️ Upload Photo'}
        </button>
      )}

      <p className="text-indigo-200 text-xs">Click photo to change</p>
    </div>
  )
}

export default AvatarUpload
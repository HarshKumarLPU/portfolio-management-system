import User from '../models/User.js'
import cloudinary from '../config/cloudinary.js'

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // Delete old avatar from cloudinary if exists
    const user = await User.findById(req.user._id)
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const publicId = user.avatar.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(`portfolio-avatars/${publicId}`)
    }

    // Update user avatar in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.path },
      { new: true }
    )

    res.status(200).json({
      success: true,
      avatar: updatedUser.avatar,
      message: 'Avatar uploaded successfully',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
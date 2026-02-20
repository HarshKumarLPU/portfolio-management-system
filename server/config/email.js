import { Resend } from 'resend'
import dotenv from 'dotenv'
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendResetEmail = async (email, resetUrl) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request - PortFolio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #6366f1, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">PortFolio</h1>
        </div>
        <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1e293b;">Reset Your Password</h2>
          <p style="color: #64748b; line-height: 1.6;">
            You requested a password reset. Click the button below to reset your password.
            This link will expire in <strong>10 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
              style="background: #6366f1; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            If you didn't request this, please ignore this email.<br/>
            This link expires in 10 minutes.
          </p>
        </div>
      </div>
    `,
  })
}

export default resend
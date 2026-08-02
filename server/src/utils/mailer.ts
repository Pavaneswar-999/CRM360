import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_USER && env.SMTP_PASSWORD ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
})

export async function sendPasswordResetEmail({ to, name, token }: { to: string; name: string; token: string }) {
  const link = `${env.APP_URL.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: 'Reset your CRM360 password',
    text: `Hi ${name},\n\nReset your CRM360 password here: ${link}\n\nThis link expires in ${env.RESET_TOKEN_TTL_MINUTES} minutes. If you did not request this, you can ignore this email.`,
    html: `<p>Hi ${name},</p><p>Reset your CRM360 password using the secure link below. It expires in ${env.RESET_TOKEN_TTL_MINUTES} minutes.</p><p><a href="${link}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  })
}

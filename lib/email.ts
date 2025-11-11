import nodemailer from 'nodemailer'

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: emailConfig.auth.user ? emailConfig.auth : undefined,
})

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}

// Email templates
export const emailTemplates = {
  verification: (name: string, verificationUrl: string) => ({
    subject: 'Verify Your Email - Noor Ul Fityan',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a5d4e 0%, #2d9474 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #1a5d4e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕌 Noor Ul Fityan</h1>
            <p>Email Verification</p>
          </div>
          <div class="content">
            <p>Assalamu Alaikum ${name || 'Brother/Sister'},</p>
            <p>Thank you for registering with Noor Ul Fityan! Please verify your email address to complete your registration.</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #1a5d4e;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>May Allah bless you and accept your good deeds.</p>
            <p>JazakAllah Khair,<br>The Noor Ul Fityan Team</p>
          </div>
          <div class="footer">
            <p>If you did not create this account, please ignore this email.</p>
            <p>Contact: Abdallah Abdul, Chairman | +254 768 209 816</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Assalamu Alaikum ${name || 'Brother/Sister'},

Thank you for registering with Noor Ul Fityan! Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

May Allah bless you and accept your good deeds.

JazakAllah Khair,
The Noor Ul Fityan Team

Contact: Abdallah Abdul, Chairman | +254 768 209 816
    `.trim(),
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Reset Your Password - Noor Ul Fityan',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a5d4e 0%, #2d9474 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #1a5d4e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕌 Noor Ul Fityan</h1>
            <p>Password Reset</p>
          </div>
          <div class="content">
            <p>Assalamu Alaikum ${name || 'Brother/Sister'},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #1a5d4e;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.
            </div>
            <p>May Allah protect you and grant you ease.</p>
            <p>JazakAllah Khair,<br>The Noor Ul Fityan Team</p>
          </div>
          <div class="footer">
            <p>Contact: Abdallah Abdul, Chairman | +254 768 209 816</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Assalamu Alaikum ${name || 'Brother/Sister'},

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour. If you did not request a password reset, please ignore this email.

May Allah protect you and grant you ease.

JazakAllah Khair,
The Noor Ul Fityan Team

Contact: Abdallah Abdul, Chairman | +254 768 209 816
    `.trim(),
  }),

  eventRegistration: (name: string, eventTitle: string, eventDate: string, eventLocation: string) => ({
    subject: `Event Registration Confirmed - ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a5d4e 0%, #2d9474 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .event-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1a5d4e; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Event Registration Confirmed</h1>
          </div>
          <div class="content">
            <p>Assalamu Alaikum ${name || 'Brother/Sister'},</p>
            <p>Your registration for the following event has been confirmed:</p>
            <div class="event-details">
              <h2 style="color: #1a5d4e; margin-top: 0;">${eventTitle}</h2>
              <p><strong>📅 Date & Time:</strong> ${eventDate}</p>
              <p><strong>📍 Location:</strong> ${eventLocation}</p>
            </div>
            <p>We look forward to seeing you there! May Allah accept your participation and grant you blessings.</p>
            <p>JazakAllah Khair,<br>The Noor Ul Fityan Team</p>
          </div>
          <div class="footer">
            <p>Contact: Abdallah Abdul, Chairman | +254 768 209 816</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Assalamu Alaikum ${name || 'Brother/Sister'},

Your registration for the following event has been confirmed:

${eventTitle}
Date & Time: ${eventDate}
Location: ${eventLocation}

We look forward to seeing you there! May Allah accept your participation and grant you blessings.

JazakAllah Khair,
The Noor Ul Fityan Team

Contact: Abdallah Abdul, Chairman | +254 768 209 816
    `.trim(),
  }),

  donationReceipt: (name: string, amount: number, donationId: string, date: string, type: string) => ({
    subject: 'Donation Receipt - Noor Ul Fityan',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a5d4e 0%, #2d9474 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .receipt { background: white; padding: 25px; border-radius: 5px; margin: 20px 0; border: 2px solid #1a5d4e; }
          .amount { font-size: 32px; font-weight: bold; color: #1a5d4e; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💝 Donation Receipt</h1>
          </div>
          <div class="content">
            <p>Assalamu Alaikum ${name || 'Brother/Sister'},</p>
            <p>Thank you for your generous donation! May Allah accept it from you and reward you abundantly.</p>
            <div class="receipt">
              <h2 style="color: #1a5d4e; margin-top: 0;">DONATION RECEIPT</h2>
              <p><strong>Receipt ID:</strong> ${donationId}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Type:</strong> ${type}</p>
              <div class="amount">$${amount.toFixed(2)}</div>
              <p style="font-style: italic; color: #666;">"And whatever you spend in charity or devotion, be sure Allah knows it all." - Quran 2:273</p>
            </div>
            <p>This is an official receipt for your donation. Please keep this for your records.</p>
            <p>JazakAllah Khair for your generosity and support.</p>
            <p>May Allah reward you abundantly,<br>The Noor Ul Fityan Team</p>
          </div>
          <div class="footer">
            <p>For any questions, contact: Abdallah Abdul, Chairman | +254 768 209 816</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Assalamu Alaikum ${name || 'Brother/Sister'},

Thank you for your generous donation! May Allah accept it from you and reward you abundantly.

DONATION RECEIPT
Receipt ID: ${donationId}
Date: ${date}
Type: ${type}
Amount: $${amount.toFixed(2)}

"And whatever you spend in charity or devotion, be sure Allah knows it all." - Quran 2:273

This is an official receipt for your donation. Please keep this for your records.

JazakAllah Khair for your generosity and support.

May Allah reward you abundantly,
The Noor Ul Fityan Team

Contact: Abdallah Abdul, Chairman | +254 768 209 816
    `.trim(),
  }),

  adminNotification: (type: 'donation' | 'registration', details: any) => ({
    subject: `New ${type === 'donation' ? 'Donation' : 'Event Registration'} - Noor Ul Fityan`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a5d4e 0%, #2d9474 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .notification { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1a5d4e; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Admin Notification</h1>
            <p>New ${type === 'donation' ? 'Donation' : 'Event Registration'}</p>
          </div>
          <div class="content">
            <p>Assalamu Alaikum,</p>
            <p>A new ${type === 'donation' ? 'donation has been received' : 'event registration has been made'}.</p>
            <div class="notification">
              ${type === 'donation' 
                ? `<p><strong>Donor:</strong> ${details.userName || details.userEmail}</p>
                   <p><strong>Amount:</strong> $${details.amount?.toFixed(2) || '0.00'}</p>
                   <p><strong>Type:</strong> ${details.type || 'N/A'}</p>
                   <p><strong>Status:</strong> ${details.status || 'pending'}</p>`
                : `<p><strong>User:</strong> ${details.userName || details.userEmail}</p>
                   <p><strong>Event:</strong> ${details.eventTitle || 'N/A'}</p>
                   <p><strong>Date:</strong> ${details.eventDate || 'N/A'}</p>`
              }
            </div>
            <p>Please log in to the admin panel to review and manage this ${type === 'donation' ? 'donation' : 'registration'}.</p>
            <p>JazakAllah Khair,<br>Noor Ul Fityan System</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from the Noor Ul Fityan platform.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Assalamu Alaikum,

A new ${type === 'donation' ? 'donation has been received' : 'event registration has been made'}.

${type === 'donation' 
  ? `Donor: ${details.userName || details.userEmail}\nAmount: $${details.amount?.toFixed(2) || '0.00'}\nType: ${details.type || 'N/A'}\nStatus: ${details.status || 'pending'}`
  : `User: ${details.userName || details.userEmail}\nEvent: ${details.eventTitle || 'N/A'}\nDate: ${details.eventDate || 'N/A'}`
}

Please log in to the admin panel to review and manage this ${type === 'donation' ? 'donation' : 'registration'}.

JazakAllah Khair,
Noor Ul Fityan System
    `.trim(),
  }),
}

// Send email function
export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  try {
    // Skip sending if email is not configured (for development)
    if (!emailConfig.auth.user) {
      console.log('Email not configured. Would send to:', to, 'Subject:', subject)
      return { success: true, message: 'Email not configured (development mode)' }
    }

    const mailOptions = {
      from: `"Noor Ul Fityan" <${emailConfig.auth.user}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}



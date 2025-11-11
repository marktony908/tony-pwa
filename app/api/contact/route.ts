import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  message: z.string().trim().min(5, 'Message should be at least 5 characters')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = contactSchema.parse(body)

    const recipient = process.env.CONTACT_EMAIL || 'info@noorulfityan.org'
    const subject = `New Contact Message from ${name}`
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `

    const text = `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`

    await sendEmail(recipient, subject, html, text)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.issues
      }, { status: 400 })
    }

    console.error('Contact form error:', error)
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}

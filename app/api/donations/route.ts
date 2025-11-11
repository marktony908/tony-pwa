import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail, emailTemplates } from '@/lib/email'

const donationSchema = z.object({
  amount: z.number().positive(),
  type: z.string(),
  description: z.string().optional(),
  paymentMethod: z.enum(['mpesa', 'manual']).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, type, description } = donationSchema.parse(body)

    const donation = await prisma.donation.create({
      data: {
        userId: session.user.id,
        amount: amount,
        type: type,
        description: description || null,
        status: 'pending',
        paymentMethod: body.paymentMethod || 'manual',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    // Send admin notification for new donation
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { email: true, name: true },
    })

    for (const admin of admins) {
      const adminEmailContent = emailTemplates.adminNotification('donation', {
        userName: donation.user.name || donation.user.email,
        userEmail: donation.user.email,
        amount: donation.amount,
        type: donation.type,
        status: donation.status,
      })

      await sendEmail(
        admin.email,
        adminEmailContent.subject,
        adminEmailContent.html,
        adminEmailContent.text
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Donation submitted successfully',
      donation: {
        id: donation.id,
        amount: donation.amount,
        type: donation.type,
        status: donation.status,
        createdAt: donation.createdAt,
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail, emailTemplates } from '@/lib/email'

const donationUpdateSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed']),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const donation = await prisma.donation.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      }
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      donation
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = donationUpdateSchema.parse(body)

    // Get donation first to check for conflicts
    const donation = await prisma.donation.findUnique({
      where: { id: params.id }
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    // Prevent manual status update if M-Pesa payment is in progress
    if (donation.paymentMethod === 'mpesa' && donation.mpesaCheckoutRequestID && donation.status === 'pending') {
      return NextResponse.json(
        { error: 'Cannot manually update donation with active M-Pesa payment. Please wait for payment to complete or fail.' },
        { status: 400 }
      )
    }

    // Update donation status
    const updatedDonation = await prisma.donation.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
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

    // Send receipt email if status changed to completed
    if (validatedData.status === 'completed' && donation.status !== 'completed') {
      const donationDate = new Date(updatedDonation.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      const emailContent = emailTemplates.donationReceipt(
        updatedDonation.user.name || 'User',
        updatedDonation.amount,
        updatedDonation.id,
        donationDate,
        updatedDonation.type
      )

      await sendEmail(
        updatedDonation.user.email,
        emailContent.subject,
        emailContent.html,
        emailContent.text
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Donation status updated successfully',
      donation: updatedDonation
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


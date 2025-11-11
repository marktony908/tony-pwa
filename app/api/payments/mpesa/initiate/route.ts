import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { initiateSTKPush, STKPushRequest } from '@/lib/mpesa'
import { z } from 'zod'

const mpesaPaymentSchema = z.object({
  donationId: z.string(),
  phoneNumber: z.string().min(10, 'Phone number is required'),
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
    const { donationId, phoneNumber } = mpesaPaymentSchema.parse(body)

    // Get donation details
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
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

    if (donation.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Prevent payment conflicts - check if donation is still pending
    if (donation.status !== 'pending') {
      return NextResponse.json(
        { error: 'Donation has already been processed' },
        { status: 400 }
      )
    }

    // Prevent duplicate M-Pesa payment attempts
    if (donation.paymentMethod === 'mpesa' && donation.mpesaCheckoutRequestID) {
      return NextResponse.json(
        { error: 'M-Pesa payment has already been initiated for this donation. Please wait for the payment to complete or contact support.' },
        { status: 400 }
      )
    }

    // Prevent M-Pesa if manual payment was already set and completed
    if (donation.paymentMethod === 'manual') {
      return NextResponse.json(
        { error: 'This donation is set for manual payment. Please contact admin to process it.' },
        { status: 400 }
      )
    }

    // Initiate M-Pesa STK Push
    const stkPushRequest: STKPushRequest = {
      phoneNumber: phoneNumber,
      amount: donation.amount,
      accountReference: `DON-${donation.id.substring(0, 8).toUpperCase()}`,
      transactionDesc: `Donation to Noor Ul Fityan - ${donation.type}`,
    }

    const mpesaResponse = await initiateSTKPush(stkPushRequest)

    if (mpesaResponse.ResponseCode === '0') {
      // Update donation with checkout request ID and payment method
      await prisma.donation.update({
        where: { id: donationId },
        data: {
          paymentMethod: 'mpesa',
          mpesaCheckoutRequestID: mpesaResponse.CheckoutRequestID,
          description: donation.description 
            ? `${donation.description} | M-Pesa Checkout: ${mpesaResponse.CheckoutRequestID}`
            : `M-Pesa Checkout: ${mpesaResponse.CheckoutRequestID}`,
        }
      })

      return NextResponse.json({
        success: true,
        message: 'M-Pesa payment request sent. Please check your phone to complete the payment.',
        checkoutRequestID: mpesaResponse.CheckoutRequestID,
        customerMessage: mpesaResponse.CustomerMessage,
      })
    } else {
      return NextResponse.json(
        { error: mpesaResponse.errorMessage || 'Failed to initiate M-Pesa payment' },
        { status: 400 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('M-Pesa payment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}


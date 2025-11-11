import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'

interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{
          Name: string
          Value: string | number
        }>
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    const body: MpesaCallbackBody = await request.json()

    const stkCallback = body.Body.stkCallback
    const checkoutRequestID = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode

    // Find donation by checkout request ID (preferred) or description (fallback)
    let donation = await prisma.donation.findFirst({
      where: {
        mpesaCheckoutRequestID: checkoutRequestID,
        status: 'pending',
      }
    })

    // Fallback: search by description if not found by checkout ID
    if (!donation) {
      const donations = await prisma.donation.findMany({
        where: {
          description: {
            contains: checkoutRequestID,
          },
          status: 'pending',
        }
      })
      donation = donations[0]
    }

    if (!donation) {
      console.error('Donation not found for checkout request:', checkoutRequestID)
      return NextResponse.json({ success: false, error: 'Donation not found' }, { status: 404 })
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata
      if (callbackMetadata && callbackMetadata.Item) {
        const receiptNumber = callbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value
        const phoneNumber = callbackMetadata.Item.find(item => item.Name === 'PhoneNumber')?.Value
        const amount = callbackMetadata.Item.find(item => item.Name === 'Amount')?.Value

        const updatedDonation = await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'completed',
            description: donation.description 
              ? `${donation.description} | M-Pesa Receipt: ${receiptNumber} | Phone: ${phoneNumber}`
              : `M-Pesa Receipt: ${receiptNumber} | Phone: ${phoneNumber}`,
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

        // Send receipt email to user
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

        console.log(`Payment successful for donation ${donation.id}. Receipt: ${receiptNumber}`)
      }
    } else {
      // Payment failed
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: 'failed',
          description: donation.description 
            ? `${donation.description} | Payment Failed: ${stkCallback.ResultDesc}`
            : `Payment Failed: ${stkCallback.ResultDesc}`,
        }
      })

      console.log(`Payment failed for donation ${donation.id}. Reason: ${stkCallback.ResultDesc}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


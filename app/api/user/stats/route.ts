import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const totalDonations = await prisma.donation.aggregate({
      where: {
        userId: session.user.id,
        status: 'completed'
      },
      _sum: {
        amount: true
      }
    })

    const registeredEvents = await prisma.eventRegistration.count({
      where: {
        userId: session.user.id,
        status: {
          in: ['registered', 'attended']
        }
      }
    })

    const totalEvents = await prisma.event.count({
      where: {
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalDonations: totalDonations._sum.amount || 0,
        totalEvents: totalEvents,
        registeredEvents: registeredEvents,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}




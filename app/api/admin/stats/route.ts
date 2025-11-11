import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const totalUsers = await prisma.user.count()
    const adminUsers = await prisma.user.count({
      where: { role: 'admin' }
    })
    const regularUsers = await prisma.user.count({
      where: { role: 'user' }
    })

    const totalEvents = await prisma.event.count()
    const activeEvents = await prisma.event.count({
      where: { isActive: true }
    })

    const totalDonations = await prisma.donation.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true }
    })

    const pendingDonations = await prisma.donation.count({
      where: { status: 'pending' }
    })

    const completedDonations = await prisma.donation.count({
      where: { status: 'completed' }
    })

    const totalRegistrations = await prisma.eventRegistration.count()
    const upcomingRegistrations = await prisma.eventRegistration.count({
      where: {
        status: 'registered',
        event: {
          date: {
            gte: new Date()
          }
        }
      }
    })

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentDonations = await prisma.donation.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const recentEvents = await prisma.event.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Donations by type
    const donationsByType = await prisma.donation.groupBy({
      by: ['type'],
      where: { status: 'completed' },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    })

    // Events by type
    const eventsByType = await prisma.event.groupBy({
      by: ['eventType'],
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
        totalEvents,
        activeEvents,
        totalDonations: totalDonations._sum.amount || 0,
        pendingDonations,
        completedDonations,
        totalRegistrations,
        upcomingRegistrations,
        recentDonations,
        recentUsers,
        recentEvents,
        donationsByType: donationsByType.map(d => ({
          type: d.type,
          total: d._sum.amount || 0,
          count: d._count.id
        })),
        eventsByType: eventsByType.map(e => ({
          type: e.eventType,
          count: e._count.id
        })),
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


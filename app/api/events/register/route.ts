import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Check if already registered
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 400 }
      )
    }

    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Register for event
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: session.user.id,
        eventId: eventId,
        status: 'registered'
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

    // Send confirmation email to user
    const user = registration.user
    const eventDate = new Date(event.date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    
    const emailContent = emailTemplates.eventRegistration(
      user.name || 'User',
      event.title,
      eventDate,
      event.location
    )

    await sendEmail(
      user.email,
      emailContent.subject,
      emailContent.html,
      emailContent.text
    )

    // Send admin notification
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { email: true, name: true },
    })

    for (const admin of admins) {
      const adminEmailContent = emailTemplates.adminNotification('registration', {
        userName: user.name || user.email,
        userEmail: user.email,
        eventTitle: event.title,
        eventDate: eventDate,
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
      message: 'Successfully registered for event',
      registration: {
        id: registration.id,
        eventId: registration.eventId,
        status: registration.status,
        createdAt: registration.createdAt,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



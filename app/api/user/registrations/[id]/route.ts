import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the registration belongs to the user
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: params.id },
      include: {
        event: {
          select: {
            date: true,
          }
        }
      }
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    if (registration.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if event has already passed
    if (new Date(registration.event.date) < new Date()) {
      return NextResponse.json(
        { error: 'Cannot cancel registration for past events' },
        { status: 400 }
      )
    }

    // Update status to cancelled instead of deleting
    await prisma.eventRegistration.update({
      where: { id: params.id },
      data: {
        status: 'cancelled'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Registration cancelled successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



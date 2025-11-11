import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  eventType: z.enum(['charity', 'spiritual', 'community', 'educational']),
  date: z.string().datetime(),
  location: z.string().min(1, 'Location is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  maxParticipants: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional().default(true),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const events = await prisma.event.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      events
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        eventType: validatedData.eventType,
        date: new Date(validatedData.date),
        location: validatedData.location,
        imageUrl: validatedData.imageUrl || null,
        maxParticipants: validatedData.maxParticipants || null,
        isActive: validatedData.isActive ?? true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

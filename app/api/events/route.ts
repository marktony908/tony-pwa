import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        date: 'asc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        eventType: true,
        date: true,
        location: true,
        isActive: true,
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




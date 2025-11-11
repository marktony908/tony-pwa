import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get only published news, ordered by published date (newest first)
    const news = await prisma.news.findMany({
      where: {
        isPublished: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 20 // Limit to 20 most recent
    })

    return NextResponse.json({
      success: true,
      news
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



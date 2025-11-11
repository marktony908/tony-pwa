import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const newsUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().optional().nullable(),
  category: z.enum(['charity', 'spiritual', 'community', 'educational', 'announcement']).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().optional(),
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

    const news = await prisma.news.findUnique({
      where: { id: params.id }
    })

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      news
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
    const validatedData = newsUpdateSchema.parse(body)

    const existingNews = await prisma.news.findUnique({
      where: { id: params.id }
    })

    if (!existingNews) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    // Handle publishedAt based on isPublished status
    let publishedAt = existingNews.publishedAt
    if (validatedData.isPublished !== undefined) {
      if (validatedData.isPublished && !existingNews.isPublished) {
        publishedAt = new Date() // Publish now
      } else if (!validatedData.isPublished) {
        publishedAt = null // Unpublish
      }
    }

    const news = await prisma.news.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt === undefined ? existingNews.excerpt : validatedData.excerpt,
        category: validatedData.category,
        imageUrl: validatedData.imageUrl === '' ? null : validatedData.imageUrl,
        isPublished: validatedData.isPublished,
        publishedAt,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'News updated successfully',
      news
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await prisma.news.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



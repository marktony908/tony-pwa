import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (search) {
      // SQLite doesn't support case-insensitive mode, so we'll use contains
      where.OR = [
        {
          user: {
            name: {
              contains: search,
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
            }
          }
        },
        {
          description: {
            contains: search,
          }
        }
      ]
    }

    const donations = await prisma.donation.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
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

    return NextResponse.json({
      success: true,
      donations
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const exportSchema = z.object({
  type: z.enum(['donations', 'events', 'users', 'registrations']),
  format: z.enum(['csv', 'json']).default('csv'),
  filters: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.string().optional(),
    type: z.string().optional(),
  }).optional(),
})

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
    const { type, format, filters } = exportSchema.parse(body)

    let data: any[] = []
    let filename = ''

    switch (type) {
      case 'donations':
        const donations = await prisma.donation.findMany({
          where: {
            ...(filters?.startDate && filters?.endDate
              ? {
                  createdAt: {
                    gte: new Date(filters.startDate),
                    lte: new Date(filters.endDate),
                  },
                }
              : {}),
            ...(filters?.status && filters.status !== 'all'
              ? { status: filters.status }
              : {}),
            ...(filters?.type && filters.type !== 'all'
              ? { type: filters.type }
              : {}),
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
        data = donations.map(d => ({
          ID: d.id,
          Amount: d.amount,
          Type: d.type,
          Status: d.status,
          PaymentMethod: d.paymentMethod || 'N/A',
          Description: d.description || '',
          DonorName: d.user.name || 'N/A',
          DonorEmail: d.user.email,
          DonorPhone: d.user.phone || 'N/A',
          CreatedAt: d.createdAt.toISOString(),
        }))
        filename = `donations-${new Date().toISOString().split('T')[0]}.${format}`
        break

      case 'events':
        const events = await prisma.event.findMany({
          where: {
            ...(filters?.startDate && filters?.endDate
              ? {
                  date: {
                    gte: new Date(filters.startDate),
                    lte: new Date(filters.endDate),
                  },
                }
              : {}),
            ...(filters?.type && filters.type !== 'all'
              ? { eventType: filters.type }
              : {}),
          },
          include: {
            _count: {
              select: {
                registrations: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        })
        data = events.map(e => ({
          ID: e.id,
          Title: e.title,
          Description: e.description,
          Type: e.eventType,
          Date: e.date.toISOString(),
          Location: e.location,
          MaxParticipants: e.maxParticipants || 'Unlimited',
          Registrations: e._count.registrations,
          Status: e.isActive ? 'Active' : 'Inactive',
          CreatedAt: e.createdAt.toISOString(),
        }))
        filename = `events-${new Date().toISOString().split('T')[0]}.${format}`
        break

      case 'users':
        const users = await prisma.user.findMany({
          where: {
            ...(filters?.startDate && filters?.endDate
              ? {
                  createdAt: {
                    gte: new Date(filters.startDate),
                    lte: new Date(filters.endDate),
                  },
                }
              : {}),
          },
          include: {
            _count: {
              select: {
                donations: true,
                eventRegistrations: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
        data = users.map(u => ({
          ID: u.id,
          Name: u.name || 'N/A',
          Email: u.email,
          Phone: u.phone || 'N/A',
          Role: u.role,
          TotalDonations: u._count.donations,
          TotalRegistrations: u._count.eventRegistrations,
          EmailVerified: u.emailVerified ? 'Yes' : 'No',
          CreatedAt: u.createdAt.toISOString(),
        }))
        filename = `users-${new Date().toISOString().split('T')[0]}.${format}`
        break

      case 'registrations':
        const registrations = await prisma.eventRegistration.findMany({
          where: {
            ...(filters?.startDate && filters?.endDate
              ? {
                  createdAt: {
                    gte: new Date(filters.startDate),
                    lte: new Date(filters.endDate),
                  },
                }
              : {}),
            ...(filters?.status && filters.status !== 'all'
              ? { status: filters.status }
              : {}),
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
            event: {
              select: {
                title: true,
                date: true,
                location: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
        data = registrations.map(r => ({
          ID: r.id,
          EventTitle: r.event.title,
          EventDate: r.event.date.toISOString(),
          EventLocation: r.event.location,
          UserName: r.user.name || 'N/A',
          UserEmail: r.user.email,
          UserPhone: r.user.phone || 'N/A',
          Status: r.status,
          Notes: r.notes || '',
          RegisteredAt: r.createdAt.toISOString(),
        }))
        filename = `registrations-${new Date().toISOString().split('T')[0]}.${format}`
        break
    }

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        return NextResponse.json(
          { error: 'No data to export' },
          { status: 400 }
        )
      }

      const headers = Object.keys(data[0])
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header]
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          }).join(',')
        ),
      ]

      const csv = csvRows.join('\n')
      const blob = Buffer.from(csv, 'utf-8')

      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    } else {
      // Return JSON
      return NextResponse.json({
        success: true,
        filename,
        data,
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



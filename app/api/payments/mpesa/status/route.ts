import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { querySTKPushStatus } from '@/lib/mpesa'
import { z } from 'zod'

const statusQuerySchema = z.object({
  checkoutRequestID: z.string(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { checkoutRequestID } = statusQuerySchema.parse(body)

    const statusResponse = await querySTKPushStatus(checkoutRequestID)

    return NextResponse.json({
      success: true,
      status: statusResponse,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}



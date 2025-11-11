import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isUserRoute = req.nextUrl.pathname.startsWith('/user')

    // Protect admin routes
    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login?error=unauthorized', req.url))
    }

    // Protect user routes
    if (isUserRoute && !token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicPaths = ['/', '/auth/login', '/auth/register']
        if (publicPaths.includes(req.nextUrl.pathname)) {
          return true
        }

        // Admin routes require admin role
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }

        // User routes require any authenticated user
        if (req.nextUrl.pathname.startsWith('/user')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/user/:path*']
}




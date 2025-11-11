'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-seaweed-50">
      <nav className="bg-seaweed-700 shadow-lg border-b border-seaweed-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/user" className="text-lg font-bold text-white">
                  Noor Ul Fityan
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/user"
                  className="border-yellow-400 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/user/events"
                  className="border-transparent text-seaweed-200 hover:border-seaweed-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Events
                </Link>
                <Link
                  href="/user/donations"
                  className="border-transparent text-seaweed-200 hover:border-seaweed-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Donations
                </Link>
                <Link
                  href="/user/profile"
                  className="border-transparent text-seaweed-200 hover:border-seaweed-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Profile
                </Link>
                <Link
                  href="/"
                  className="border-transparent text-seaweed-200 hover:border-seaweed-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Main Site
                </Link>
                <Link
                  href="/#contact"
                  className="border-transparent text-seaweed-200 hover:border-seaweed-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {session && (
                <span className="text-sm text-seaweed-100">
                  {session.user?.name || session.user?.email}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}


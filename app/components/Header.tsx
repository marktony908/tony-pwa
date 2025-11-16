"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold text-seaweed-800">Noor Ul Fityan</Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-6" aria-label="Primary">
            <Link href="/" className="text-sm text-gray-700 hover:text-seaweed-600">Home</Link>
            <Link href="/pages/about" className="text-sm text-gray-700 hover:text-seaweed-600">About</Link>
            <Link href="/pages/help" className="text-sm text-seaweed-700 font-medium border-b-2 border-seaweed-600 pb-0.5">Help</Link>
            <Link href="/#contact" className="text-sm text-gray-700 hover:text-seaweed-600">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/user/profile" className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-seaweed-700 border border-seaweed-200 hover:bg-seaweed-50">Profile</Link>
            ) : (
              <Link href="/auth/login" className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-seaweed-700 hover:bg-seaweed-50">Sign in</Link>
            )}

            <Link href="/user/donations" className="hidden sm:inline-flex items-center px-4 py-2 bg-seaweed-600 text-white rounded-md text-sm font-semibold hover:bg-seaweed-700">Donate</Link>

            <button onClick={() => setOpen(!open)} aria-label="Open menu" className="lg:hidden p-2 text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 rounded-md">Home</Link>
            <Link href="/pages/about" className="block px-3 py-2 text-gray-700 rounded-md">About</Link>
            <Link href="/pages/help" className="block px-3 py-2 text-seaweed-700 font-medium rounded-md">Help</Link>
            <Link href="/#contact" className="block px-3 py-2 text-gray-700 rounded-md">Contact</Link>
            <Link href="/user/donations" className="block px-3 py-2 mt-2 bg-seaweed-600 text-white rounded-md text-center">Donate</Link>
          </div>
        </div>
      )}
    </header>
  )
}

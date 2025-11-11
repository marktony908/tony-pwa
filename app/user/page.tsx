'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function UserHome() {
  const { data: session } = useSession()

  return (
    <div className="px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">
          Welcome, {session?.user?.name || 'Member'}!
        </h1>
        <p className="text-base text-seaweed-600">
          Assalamu Alaikum. Welcome to the Noor Ul Fityan community platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Link href="/user/events" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-seaweed-500">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">📅</span>
            <h2 className="text-xl font-bold text-seaweed-800">Events</h2>
          </div>
          <p className="text-gray-700 mb-3 text-sm">
            View and register for upcoming charity activities, spiritual gatherings, and community events.
          </p>
          <span className="text-seaweed-600 font-medium text-sm">View Events →</span>
        </Link>

        <Link href="/user/donations" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">💝</span>
            <h2 className="text-xl font-bold text-seaweed-800">Donations</h2>
          </div>
          <p className="text-gray-700 mb-3 text-sm">
            Make charitable contributions and support our community initiatives for the sake of Allah.
          </p>
          <span className="text-seaweed-600 font-medium text-sm">Make Donation →</span>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-seaweed-600 to-seaweed-700 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-3">Our Mission</h2>
        <p className="text-sm mb-3 text-seaweed-100">
          Noor Ul Fityan is committed to fostering unity, promoting growth, and encouraging good deeds 
          for the sake of Allah. We believe in supporting each other spiritually, engaging in charity, 
          and working together to make a positive impact in our community and beyond.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-seaweed-800 bg-opacity-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-1 text-sm">🤝 Unity</h3>
            <p className="text-xs text-seaweed-100">Building strong bonds within our community</p>
          </div>
          <div className="bg-seaweed-800 bg-opacity-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-1 text-sm">🌱 Growth</h3>
            <p className="text-xs text-seaweed-100">Personal and spiritual development</p>
          </div>
          <div className="bg-seaweed-800 bg-opacity-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-1 text-sm">❤️ Good Deeds</h3>
            <p className="text-xs text-seaweed-100">Making a positive impact for Allah</p>
          </div>
        </div>
      </div>
    </div>
  )
}


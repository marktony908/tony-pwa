'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function UserDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalEvents: 0,
    registeredEvents: 0,
  })

  useEffect(() => {
    fetch('/api/user/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats)
        }
      })
      .catch(err => console.error('Error fetching stats:', err))
  }, [])

  return (
    <div className="px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">My Dashboard</h1>
        <p className="text-base text-seaweed-600">
          Assalamu Alaikum, {session?.user?.name || 'Member'}. Here's your activity overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-seaweed-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Donations</h3>
          <p className="text-2xl font-bold text-seaweed-600">${stats.totalDonations.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">May Allah accept it</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Registered Events</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.registeredEvents}</p>
          <p className="text-xs text-gray-600 mt-1">Upcoming activities</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-seaweed-700">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Available Events</h3>
          <p className="text-2xl font-bold text-seaweed-700">{stats.totalEvents}</p>
          <p className="text-xs text-gray-600 mt-1">Events to join</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/user/events" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">📅</span>
            <h2 className="text-xl font-bold text-seaweed-800">View Events</h2>
          </div>
          <p className="text-gray-700 text-sm">Browse and register for upcoming community activities</p>
        </Link>

        <Link href="/user/donations" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">💝</span>
            <h2 className="text-xl font-bold text-seaweed-800">Make Donation</h2>
          </div>
          <p className="text-gray-700 text-sm">Support our charity initiatives and community projects</p>
        </Link>

        <Link href="/user/events/registrations" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">📋</span>
            <h2 className="text-xl font-bold text-seaweed-800">My Registrations</h2>
          </div>
          <p className="text-gray-700 text-sm">View and manage your event registrations</p>
        </Link>

        <Link href="/user/profile" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">👤</span>
            <h2 className="text-xl font-bold text-seaweed-800">My Profile</h2>
          </div>
          <p className="text-gray-700 text-sm">Manage your personal information and account settings</p>
        </Link>
      </div>
    </div>
  )
}


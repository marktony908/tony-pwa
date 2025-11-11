'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalDonations: 0,
    pendingDonations: 0,
    completedDonations: 0,
    totalRegistrations: 0,
    upcomingRegistrations: 0,
    recentDonations: 0,
    recentUsers: 0,
    recentEvents: 0,
    donationsByType: [] as Array<{ type: string; total: number; count: number }>,
    eventsByType: [] as Array<{ type: string; count: number }>,
  })

  useEffect(() => {
    fetch('/api/admin/stats')
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
        <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">Admin Dashboard</h1>
        <p className="text-base text-seaweed-600">
          Assalamu Alaikum, {session?.user?.name || session?.user?.email}. Manage Noor Ul Fityan from here.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-seaweed-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Members</h3>
          <p className="mt-2 text-2xl font-bold text-seaweed-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-black">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Admins</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-seaweed-600">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Regular Members</h3>
          <p className="mt-2 text-2xl font-bold text-seaweed-700">{stats.regularUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Events</h3>
          <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.totalEvents}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-400">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Active Events</h3>
          <p className="mt-2 text-2xl font-bold text-yellow-700">{stats.activeEvents}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-seaweed-400">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Donations</h3>
          <p className="mt-2 text-2xl font-bold text-seaweed-500">${stats.totalDonations.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Completed Donations</h3>
          <p className="mt-2 text-2xl font-bold text-green-600">{stats.completedDonations}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Registrations</h3>
          <p className="mt-2 text-2xl font-bold text-blue-600">{stats.totalRegistrations}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Upcoming Registrations</h3>
          <p className="mt-2 text-2xl font-bold text-purple-600">{stats.upcomingRegistrations}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-seaweed-800 mb-4">Recent Activity (Last 30 Days)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-seaweed-50 rounded-lg">
            <p className="text-3xl font-bold text-seaweed-600">{stats.recentDonations}</p>
            <p className="text-sm text-gray-600 mt-1">New Donations</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{stats.recentUsers}</p>
            <p className="text-sm text-gray-600 mt-1">New Members</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{stats.recentEvents}</p>
            <p className="text-sm text-gray-600 mt-1">New Events</p>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-seaweed-800 mb-4">Donations by Type</h2>
          {stats.donationsByType.length > 0 ? (
            <div className="space-y-3">
              {stats.donationsByType.map((item) => (
                <div key={item.type} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{item.type}</p>
                    <p className="text-sm text-gray-500">{item.count} donations</p>
                  </div>
                  <p className="text-lg font-bold text-seaweed-600">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No donations yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-seaweed-800 mb-4">Events by Type</h2>
          {stats.eventsByType.length > 0 ? (
            <div className="space-y-3">
              {stats.eventsByType.map((item) => (
                <div key={item.type} className="flex justify-between items-center">
                  <p className="font-medium text-gray-900 capitalize">{item.type}</p>
                  <p className="text-lg font-bold text-yellow-600">{item.count} events</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No events yet</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/events" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-seaweed-500">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">📅</span>
            <h2 className="text-xl font-bold text-seaweed-800">Manage Events</h2>
          </div>
          <p className="text-gray-700 text-sm">Create and manage charity activities, spiritual gatherings, and community events</p>
        </Link>

        <Link href="/admin/donations" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">💝</span>
            <h2 className="text-xl font-bold text-seaweed-800">Manage Donations</h2>
          </div>
          <p className="text-gray-700 text-sm">View and manage all donations, track contributions, and process payments</p>
        </Link>

        <Link href="/admin/users" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-black">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">👥</span>
            <h2 className="text-xl font-bold text-seaweed-800">Manage Members</h2>
          </div>
          <p className="text-gray-700 text-sm">View all members, manage roles, and oversee community participation</p>
        </Link>

        <Link href="/admin/news" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">📰</span>
            <h2 className="text-xl font-bold text-seaweed-800">Manage News</h2>
          </div>
          <p className="text-gray-700 text-sm">Create and publish news articles, announcements, and community updates</p>
        </Link>

        <Link href="/admin/settings" className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-seaweed-700">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">⚙️</span>
            <h2 className="text-xl font-bold text-seaweed-800">Settings</h2>
          </div>
          <p className="text-gray-700 text-sm">Configure platform settings, update organization information, and manage preferences</p>
        </Link>
      </div>
    </div>
  )
}


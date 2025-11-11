'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import ConfirmDialog from '@/app/components/ConfirmDialog'

interface Registration {
  id: string
  status: string
  createdAt: string
  event: {
    id: string
    title: string
    description: string
    eventType: string
    date: string
    location: string
    imageUrl: string | null
    isActive: boolean
  }
}

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [cancelConfirm, setCancelConfirm] = useState<{ isOpen: boolean; registrationId: string | null }>({
    isOpen: false,
    registrationId: null,
  })

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/user/registrations')
      const data = await res.json()
      if (data.success) {
        setRegistrations(data.registrations)
      }
    } catch (err) {
      toast.error('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelConfirm.registrationId) return

    setCancelling(cancelConfirm.registrationId)
    try {
      const res = await fetch(`/api/user/registrations/${cancelConfirm.registrationId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Registration cancelled successfully')
        setCancelConfirm({ isOpen: false, registrationId: null })
        fetchRegistrations()
      } else {
        toast.error(data.error || 'Failed to cancel registration')
      }
    } catch (error) {
      toast.error('Error cancelling registration')
    } finally {
      setCancelling(null)
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'charity': return { bg: 'bg-seaweed-100', text: 'text-seaweed-800', border: 'border-seaweed-300', icon: '🤲' }
      case 'spiritual': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: '🕌' }
      case 'community': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: '👥' }
      case 'educational': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: '📚' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: '📅' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      full: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isPast: date < new Date(),
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-seaweed-600 mx-auto mb-4"></div>
          <p className="text-seaweed-600">Loading registrations...</p>
        </div>
      </div>
    )
  }

  const upcomingRegistrations = registrations.filter(r => {
    const eventDate = new Date(r.event.date)
    return eventDate >= new Date() && r.status !== 'cancelled'
  })

  const pastRegistrations = registrations.filter(r => {
    const eventDate = new Date(r.event.date)
    return eventDate < new Date() || r.status === 'cancelled'
  })

  return (
    <div className="px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">My Event Registrations</h1>
          <p className="text-base text-seaweed-600">
            View and manage your event registrations
          </p>
        </div>
        <Link
          href="/user/events"
          className="bg-seaweed-600 text-white px-4 py-2 rounded-lg hover:bg-seaweed-700 transition-colors font-medium text-sm"
        >
          Browse Events
        </Link>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No registrations yet</h3>
          <p className="text-gray-600 mb-4">Start registering for events to get involved!</p>
          <Link
            href="/user/events"
            className="inline-block px-6 py-2 bg-seaweed-600 text-white rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcomingRegistrations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-seaweed-800 mb-4">Upcoming Events ({upcomingRegistrations.length})</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingRegistrations.map((registration) => {
                  const typeColors = getEventTypeColor(registration.event.eventType)
                  const dateInfo = formatDate(registration.event.date)

                  return (
                    <div
                      key={registration.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
                      style={{ borderLeftColor: registration.event.eventType === 'charity' ? '#2d9474' : registration.event.eventType === 'spiritual' ? '#facc15' : '#1a5d4e' }}
                    >
                      {registration.event.imageUrl ? (
                        <div className="h-40 bg-gradient-to-br from-seaweed-400 to-seaweed-600 relative overflow-hidden">
                          <img src={registration.event.imageUrl} alt={registration.event.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-40 bg-gradient-to-br from-seaweed-400 to-seaweed-600 relative overflow-hidden flex items-center justify-center">
                          <span className="text-6xl opacity-30">{typeColors.icon}</span>
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors.bg} ${typeColors.text} border ${typeColors.border}`}>
                            <span className="mr-1">{typeColors.icon}</span>
                            {registration.event.eventType.charAt(0).toUpperCase() + registration.event.eventType.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            registration.status === 'attended' ? 'bg-green-100 text-green-800' :
                            registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {registration.status}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold mb-2" style={{ color: '#1a5d4e' }}>
                          {registration.event.title}
                        </h2>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {registration.event.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-700 text-sm">
                            <span className="mr-2 text-base">📅</span>
                            <div>
                              <div className="font-medium">{dateInfo.full}</div>
                              <div className="text-xs text-gray-500">{dateInfo.time}</div>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-700 text-sm">
                            <span className="mr-2 text-base">📍</span>
                            <span>{registration.event.location}</span>
                          </div>
                        </div>

                        {registration.status === 'registered' && (
                          <button
                            onClick={() => setCancelConfirm({ isOpen: true, registrationId: registration.id })}
                            disabled={cancelling === registration.id}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelling === registration.id ? 'Cancelling...' : 'Cancel Registration'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastRegistrations.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-seaweed-800 mb-4">Past Events ({pastRegistrations.length})</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {pastRegistrations.map((registration) => {
                  const typeColors = getEventTypeColor(registration.event.eventType)
                  const dateInfo = formatDate(registration.event.date)

                  return (
                    <div
                      key={registration.id}
                      className="bg-white rounded-lg shadow-md border-l-4 opacity-75"
                      style={{ borderLeftColor: registration.event.eventType === 'charity' ? '#2d9474' : registration.event.eventType === 'spiritual' ? '#facc15' : '#1a5d4e' }}
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors.bg} ${typeColors.text} border ${typeColors.border}`}>
                            <span className="mr-1">{typeColors.icon}</span>
                            {registration.event.eventType.charAt(0).toUpperCase() + registration.event.eventType.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            registration.status === 'attended' ? 'bg-green-100 text-green-800' :
                            registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {registration.status}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold mb-2" style={{ color: '#1a5d4e' }}>
                          {registration.event.title}
                        </h2>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600 text-sm">
                            <span className="mr-2">📅</span>
                            <span>{dateInfo.full}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <span className="mr-2">📍</span>
                            <span>{registration.event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={cancelConfirm.isOpen}
        title="Cancel Registration"
        message="Are you sure you want to cancel this event registration? This action cannot be undone."
        confirmText="Cancel Registration"
        cancelText="Keep Registration"
        variant="warning"
        onConfirm={handleCancel}
        onCancel={() => setCancelConfirm({ isOpen: false, registrationId: null })}
      />
    </div>
  )
}



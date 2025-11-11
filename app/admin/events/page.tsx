'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/app/components/Modal'
import ConfirmDialog from '@/app/components/ConfirmDialog'

interface Event {
  id: string
  title: string
  description: string
  eventType: string
  date: string
  location: string
  imageUrl?: string | null
  maxParticipants?: number | null
  isActive: boolean
  createdAt: string
  _count?: {
    registrations: number
  }
}

interface Registration {
  id: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
  }
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; eventId: string | null }>({
    isOpen: false,
    eventId: null,
  })
  const [toggleConfirm, setToggleConfirm] = useState<{ isOpen: boolean; event: Event | null }>({
    isOpen: false,
    event: null,
  })

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'charity' as 'charity' | 'spiritual' | 'community' | 'educational',
    date: '',
    location: '',
    imageUrl: '',
    maxParticipants: '',
    isActive: true,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events')
      const data = await res.json()
      if (data.success) {
        setEvents(data.events)
        setFilteredEvents(data.events)
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = events

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      )
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.eventType === typeFilter)
    }

    setFilteredEvents(filtered)
  }, [searchQuery, typeFilter, events])

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'charity',
      date: '',
      location: '',
      imageUrl: '',
      maxParticipants: '',
      isActive: true,
    })
    setIsCreateModalOpen(true)
  }

  const handleEdit = (event: Event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType as any,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      imageUrl: event.imageUrl || '',
      maxParticipants: event.maxParticipants?.toString() || '',
      isActive: event.isActive,
    })
    setIsEditModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = selectedEvent
        ? `/api/admin/events/${selectedEvent.id}`
        : '/api/admin/events'
      const method = selectedEvent ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        date: new Date(formData.date).toISOString(),
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message || 'Event saved successfully')
        setIsCreateModalOpen(false)
        setIsEditModalOpen(false)
        setSelectedEvent(null)
        fetchEvents()
      } else {
        toast.error(data.error || 'Failed to save event')
      }
    } catch (error) {
      toast.error('Error saving event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm.eventId) return

    try {
      const res = await fetch(`/api/admin/events/${deleteConfirm.eventId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Event deleted successfully')
        setDeleteConfirm({ isOpen: false, eventId: null })
        fetchEvents()
      } else {
        toast.error(data.error || 'Failed to delete event')
      }
    } catch (error) {
      toast.error('Error deleting event')
    }
  }

  const handleToggle = async () => {
    if (!toggleConfirm.event) return

    try {
      const res = await fetch(`/api/admin/events/${toggleConfirm.event.id}/toggle`, {
        method: 'PATCH',
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        setToggleConfirm({ isOpen: false, event: null })
        fetchEvents()
      } else {
        toast.error(data.error || 'Failed to update event')
      }
    } catch (error) {
      toast.error('Error updating event')
    }
  }

  const handleViewRegistrations = async (event: Event) => {
    setSelectedEvent(event)
    try {
      const res = await fetch(`/api/admin/events/${event.id}/registrations`)
      const data = await res.json()
      if (data.success) {
        setRegistrations(data.registrations)
        setIsRegistrationsModalOpen(true)
      } else {
        toast.error(data.error || 'Failed to load registrations')
      }
    } catch (error) {
      toast.error('Error loading registrations')
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-seaweed-600 mx-auto mb-4"></div>
          <p className="text-seaweed-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">Event Management</h1>
          <p className="text-base text-seaweed-600">Create and manage charity activities, spiritual gatherings, and community events</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/admin/export', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'events',
                    format: 'csv',
                    filters: {
                      type: typeFilter !== 'all' ? typeFilter : undefined,
                    },
                  }),
                })
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `events-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
                toast.success('Events exported successfully')
              } catch (error) {
                toast.error('Failed to export events')
              }
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            📥 Export
          </button>
          <button
            onClick={handleCreate}
            className="bg-seaweed-600 text-white px-5 py-2 rounded-lg hover:bg-seaweed-700 transition-colors font-medium text-sm"
          >
            + Create Event
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
            >
              <option value="all">All Types</option>
              <option value="charity">Charity</option>
              <option value="spiritual">Spiritual</option>
              <option value="community">Community</option>
              <option value="educational">Educational</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('')
                setTypeFilter('all')
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No events created yet.</p>
          <p className="text-gray-500 mt-2">Create your first event to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white shadow-md rounded-lg overflow-hidden border-l-4 border-seaweed-500">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.eventType === 'charity' ? 'bg-seaweed-100 text-seaweed-800' :
                    event.eventType === 'spiritual' ? 'bg-yellow-100 text-yellow-800' :
                    event.eventType === 'community' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    event.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {event.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-seaweed-800 mb-2">{event.title}</h2>
                <p className="text-gray-700 mb-3 text-sm line-clamp-2">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">📅</span>
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">📍</span>
                    <span className="truncate">{event.location}</span>
                  </div>
                  {event._count && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <span className="mr-2">👥</span>
                      <span>{event._count.registrations} registered</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 bg-seaweed-600 text-white px-4 py-2 rounded-lg hover:bg-seaweed-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewRegistrations(event)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View ({event._count?.registrations || 0})
                  </button>
                  <button
                    onClick={() => setToggleConfirm({ isOpen: true, event })}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm ${
                      event.isActive
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {event.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: true, eventId: event.id })}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        title={selectedEvent ? 'Edit Event' : 'Create New Event'}
        onClose={() => {
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
          setSelectedEvent(null)
        }}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
              placeholder="Enter event description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type *
              </label>
              <select
                required
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
              >
                <option value="charity">Charity</option>
                <option value="spiritual">Spiritual</option>
                <option value="community">Community</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
              placeholder="Enter event location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants (Optional)
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-seaweed-600 focus:ring-seaweed-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Event is active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false)
                setIsEditModalOpen(false)
                setSelectedEvent(null)
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-seaweed-600 text-white rounded-lg hover:bg-seaweed-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : selectedEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Registrations Modal */}
      <Modal
        isOpen={isRegistrationsModalOpen}
        title={`Registrations - ${selectedEvent?.title}`}
        onClose={() => {
          setIsRegistrationsModalOpen(false)
          setSelectedEvent(null)
        }}
        size="lg"
      >
        {registrations.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No registrations yet.</p>
        ) : (
          <div className="space-y-3">
            {registrations.map((reg) => (
              <div key={reg.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{reg.user.name || 'No name'}</p>
                    <p className="text-sm text-gray-600">{reg.user.email}</p>
                    {reg.user.phone && (
                      <p className="text-sm text-gray-600">📞 {reg.user.phone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reg.status === 'attended' ? 'bg-green-100 text-green-800' :
                      reg.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {reg.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and will also delete all registrations."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, eventId: null })}
      />

      {/* Toggle Confirmation */}
      <ConfirmDialog
        isOpen={toggleConfirm.isOpen}
        title={toggleConfirm.event?.isActive ? 'Deactivate Event' : 'Activate Event'}
        message={`Are you sure you want to ${toggleConfirm.event?.isActive ? 'deactivate' : 'activate'} this event?`}
        confirmText={toggleConfirm.event?.isActive ? 'Deactivate' : 'Activate'}
        cancelText="Cancel"
        variant="warning"
        onConfirm={handleToggle}
        onCancel={() => setToggleConfirm({ isOpen: false, event: null })}
      />
    </div>
  )
}

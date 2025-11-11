'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Event {
  id: string
  title: string
  description: string
  eventType: string
  date: string
  location: string
  imageUrl?: string
  isActive: boolean
  maxParticipants?: number
}

interface NewsItem {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  imageUrl?: string
}

export default function NewsEventsPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'news'>('events')
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState<string | null>(null)
  const [userRegistrations, setUserRegistrations] = useState<Set<string>>(new Set())
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events)
          setFilteredEvents(data.events)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching events:', err)
        setLoading(false)
      })

    // Fetch user registrations
    fetch('/api/user/registrations')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const registeredEventIds = new Set<string>(
            data.registrations
              .filter((r: any) => r.status === 'registered' || r.status === 'attended')
              .map((r: any) => r.event.id as string)
          )
          setUserRegistrations(registeredEventIds)
        }
      })
      .catch(err => {
        console.error('Error fetching registrations:', err)
      })

    // Fetch news
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formattedNews: NewsItem[] = data.news.map((item: any) => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || item.content.substring(0, 150) + '...',
            date: item.publishedAt || item.createdAt,
            category: item.category,
            imageUrl: item.imageUrl,
          }))
          setNewsItems(formattedNews)
        }
      })
      .catch(err => {
        console.error('Error fetching news:', err)
      })
  }, [])

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(events.filter(event => event.eventType === selectedFilter))
    }
  }, [selectedFilter, events])

  const handleRegister = async (eventId: string) => {
    setRegistering(eventId)
    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Successfully registered for the event!')
        // Update registration status
        setUserRegistrations(prev => {
          const newSet = new Set<string>(prev)
          newSet.add(eventId)
          return newSet
        })
      } else {
        toast.error(data.error || 'Failed to register')
      }
    } catch (err) {
      toast.error('Error registering for event')
    } finally {
      setRegistering(null)
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'charity': return { bg: 'bg-seaweed-100', text: 'text-seaweed-800', border: 'border-seaweed-300', icon: '🤲' }
      case 'spiritual': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: '🕌' }
      case 'community': return { bg: 'bg-seaweed-200', text: 'text-seaweed-900', border: 'border-seaweed-400', icon: '👥' }
      case 'educational': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: '📚' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: '📅' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  }

  const filterOptions = [
    { value: 'all', label: 'All Events', icon: '📅' },
    { value: 'charity', label: 'Charity', icon: '🤲' },
    { value: 'spiritual', label: 'Spiritual', icon: '🕌' },
    { value: 'community', label: 'Community', icon: '👥' },
    { value: 'educational', label: 'Educational', icon: '📚' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-seaweed-50 to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-seaweed-600 mx-auto mb-4"></div>
            <p className="text-seaweed-600">Loading events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-seaweed-50 to-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#1a5d4e' }}>
            News & Events
          </h1>
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-yellow-400 mx-auto mb-3 sm:mb-4 rounded-full"></div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest news and join us for upcoming events
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-md border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-seaweed-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-seaweed-600'
              }`}
            >
              📅 Events
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-seaweed-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-seaweed-600'
              }`}
            >
              📰 News
            </button>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              {filterOptions.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    selectedFilter === filter.value
                      ? 'bg-seaweed-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-seaweed-50 border border-gray-200'
                  }`}
                >
                  <span className="mr-1">{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No events available</h3>
                <p className="text-gray-600 mb-4">Check back soon for upcoming activities!</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-2 bg-seaweed-600 text-white rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredEvents.map((event) => {
                  const typeColors = getEventTypeColor(event.eventType)
                  const dateInfo = formatDate(event.date)
                  const isPastEvent = new Date(event.date) < new Date()

                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
                      style={{ borderLeftColor: event.eventType === 'charity' ? '#2d9474' : event.eventType === 'spiritual' ? '#facc15' : '#1a5d4e' }}
                    >
                      {/* Event Image Placeholder */}
                      {event.imageUrl ? (
                        <div className="h-40 bg-gradient-to-br from-seaweed-400 to-seaweed-600 relative overflow-hidden">
                          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-40 bg-gradient-to-br from-seaweed-400 to-seaweed-600 relative overflow-hidden flex items-center justify-center">
                          <span className="text-6xl opacity-30">{typeColors.icon}</span>
                        </div>
                      )}

                      <div className="p-4 sm:p-5">
                        {/* Event Type Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${typeColors.bg} ${typeColors.text} border ${typeColors.border}`}>
                            <span className="mr-1">{typeColors.icon}</span>
                            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                          </span>
                          {isPastEvent && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                              Past
                            </span>
                          )}
                        </div>

                        {/* Event Title */}
                        <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: '#1a5d4e' }}>
                          {event.title}
                        </h2>

                        {/* Event Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        {/* Event Details */}
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
                            <span>{event.location}</span>
                          </div>
                          {event.maxParticipants && (
                            <div className="flex items-center text-gray-700 text-sm">
                              <span className="mr-2 text-base">👥</span>
                              <span>Max {event.maxParticipants} participants</span>
                            </div>
                          )}
                        </div>

                        {/* Register Button */}
                        {event.isActive && !isPastEvent && (
                          <>
                            {userRegistrations.has(event.id) ? (
                              <div className="w-full bg-green-100 text-green-800 px-4 py-2.5 rounded-lg text-center font-semibold text-sm border border-green-300">
                                ✓ Registered
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRegister(event.id)}
                                disabled={registering === event.id}
                                className="w-full bg-seaweed-600 text-white px-4 py-2.5 rounded-lg hover:bg-seaweed-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                {registering === event.id ? 'Registering...' : 'Register Now'}
                              </button>
                            )}
                          </>
                        )}
                        {isPastEvent && (
                          <div className="w-full bg-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-center font-semibold text-sm">
                            Event Ended
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {newsItems.map((news) => {
              const dateInfo = formatDate(news.date)
              const newsColors = getEventTypeColor(news.category)

              return (
                <article
                  key={news.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
                  style={{ borderLeftColor: news.category === 'charity' ? '#2d9474' : news.category === 'spiritual' ? '#facc15' : '#1a5d4e' }}
                >
                  {/* News Image Placeholder */}
                  {news.imageUrl ? (
                    <div className="h-40 bg-gradient-to-br from-seaweed-400 to-seaweed-600 relative overflow-hidden">
                      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-seaweed-400 to-seaweed-600 relative overflow-hidden flex items-center justify-center">
                      <span className="text-6xl opacity-30">{newsColors.icon}</span>
                    </div>
                  )}

                  <div className="p-4 sm:p-5">
                    {/* Category Badge */}
                    <span className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold mb-3 ${newsColors.bg} ${newsColors.text} border ${newsColors.border}`}>
                      {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                    </span>

                    {/* News Title */}
                    <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: '#1a5d4e' }}>
                      {news.title}
                    </h2>

                    {/* News Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {news.excerpt}
                    </p>

                    {/* News Date */}
                    <div className="flex items-center text-gray-500 text-xs">
                      <span className="mr-2">📅</span>
                      <span>{dateInfo.full}</span>
                    </div>

                    {/* Read More Link */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Navigate to news detail page
                          alert('News detail page coming soon!')
                        }}
                        className="text-seaweed-600 hover:text-seaweed-700 font-semibold text-sm flex items-center cursor-pointer transition-colors"
                      >
                        Read More
                        <span className="ml-1">→</span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

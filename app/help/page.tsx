'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function HelpPage() {
  const { data: session } = useSession()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const helpCategories = [
    {
      id: 1,
      title: 'Make a Donation',
      emoji: '🕌',
      description: 'Support our charity initiatives with financial contributions. Every donation helps us provide food, clothing, educational support, and financial assistance to those in need.',
      link: '/user/donations',
      buttonText: 'Donate Now',
      icon: '💝'
    },
    {
      id: 2,
      title: 'Attend Events',
      emoji: '📿',
      description: 'Join our spiritual gatherings, study circles, and community events. Participate in charity activities and connect with fellow community members.',
      link: '/user/events',
      buttonText: 'View Events',
      icon: '📅'
    },
    {
      id: 3,
      title: 'Spread the Word',
      emoji: '👥',
      description: 'Help us grow our community by sharing our mission with others. Follow us on social media, invite friends and family, and help amplify our impact.',
      link: '/auth/register',
      buttonText: 'Get Started',
      icon: '📢'
    },
    {
      id: 4,
      title: 'Volunteer',
      emoji: '🌍',
      description: 'Volunteer your time and skills for community projects, environmental initiatives, and social causes. Your involvement makes a real difference in people\'s lives.',
      link: '/auth/register',
      buttonText: 'Join Us',
      icon: '🤝'
    }
  ]

  const faqs = [
    {
      id: 1,
      question: 'How do I make a donation?',
      answer: 'You can make a donation by visiting our Donations page. We accept various payment methods including M-Pesa, bank transfers, and card payments. Every contribution, no matter how small, makes a significant difference in our community.'
    },
    {
      id: 2,
      question: 'Can I volunteer without registering?',
      answer: 'While you can learn about our organization without registering, to participate in volunteer opportunities and community activities, you\'ll need to create an account. Registration is quick and free!'
    },
    {
      id: 3,
      question: 'What are the different types of events?',
      answer: 'We organize spiritual gatherings, educational workshops, community service projects, and social events. Each event is designed to bring our community together and create meaningful connections.'
    },
    {
      id: 4,
      question: 'How can I stay updated with news and announcements?',
      answer: 'You can stay updated by registering on our platform, following our social media accounts, and subscribing to our newsletter. Members receive regular updates about upcoming events and initiatives.'
    },
    {
      id: 5,
      question: 'Is my donation tax-deductible?',
      answer: 'Please check with your tax advisor regarding the tax deductibility of donations. We recommend contacting our office directly for documentation and specific tax information.'
    },
    {
      id: 6,
      question: 'How do I contact the organization?',
      answer: 'You can reach us through our Contact page, email, or by visiting our office. Our team is available to answer any questions and assist you with all your inquiries.'
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* New layout: left hero/CTA (2 cols) and right feature list (1 col) */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50 via-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Hero + Intro (span 2) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg p-10 md:p-14">
                <h1 className="text-3xl md:text-4xl font-extrabold text-seaweed-900 mb-5">How You Can Help</h1>
                <p className="text-lg text-gray-700 mb-8">We welcome your support in many forms — donations, volunteering, attending events, and helping spread our mission. Below you'll find practical ways to get started.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-seaweed-50 rounded-xl text-center">
                    <div className="text-4xl">💝</div>
                    <div className="font-semibold mt-3">Donate</div>
                    <div className="text-sm text-gray-600 mt-2">Secure payments for direct impact</div>
                  </div>
                  <div className="p-6 bg-yellow-50 rounded-xl text-center">
                    <div className="text-4xl">📅</div>
                    <div className="font-semibold mt-3">Events</div>
                    <div className="text-sm text-gray-600 mt-2">Join community programs and gatherings</div>
                  </div>
                  <div className="p-6 bg-seaweed-50 rounded-xl text-center">
                    <div className="text-4xl">🤝</div>
                    <div className="font-semibold mt-3">Volunteer</div>
                    <div className="text-sm text-gray-600 mt-2">Lend skills and time to projects</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/user/donations" className="inline-block px-8 py-3 bg-seaweed-700 text-white rounded-lg font-semibold hover:bg-seaweed-800">Donate Now</Link>
                  <Link href="/user/events" className="inline-block px-8 py-3 border border-seaweed-200 rounded-lg text-seaweed-700 hover:bg-seaweed-50">See Events</Link>
                  <Link href="/auth/register" className="inline-block px-8 py-3 bg-white border border-gray-200 rounded-lg text-seaweed-700 hover:bg-gray-50">Become a Member</Link>
                </div>
              </div>
            </div>

            {/* Right: Feature list */}
            <aside>
              <div className="space-y-5">
                {helpCategories.map((c) => (
                  <div key={c.id} className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <div className="text-3xl">{c.emoji}</div>
                    <div>
                      <h4 className="font-semibold text-seaweed-800">{c.title}</h4>
                      <p className="text-sm text-gray-600">{c.description}</p>
                      <div className="mt-3">
                        <Link href={c.link} className="text-sm font-semibold text-seaweed-700 hover:underline">{c.buttonText} →</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #1a5d4e 0%, #2d9474 50%, #1a5d4e 100%)',
        backgroundSize: '200% 200%'
      }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 -left-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 right-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              How Can You Help?
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
              Discover multiple ways to make a difference in our community. Whether through donations, volunteering, or spreading the word, your contribution matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/user/donations"
                className="inline-block bg-yellow-400 text-seaweed-900 px-8 py-3 rounded-lg font-bold text-base hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                💝 Start Donating
              </Link>
              <Link
                href="/user/events"
                className="inline-block bg-white/20 text-white border-2 border-white px-8 py-3 rounded-lg font-bold text-base hover:bg-white/30 transition-all duration-200"
              >
                📅 View Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Help Section */}
      <section className="py-12 sm:py-16 md:py-20 relative" style={{ backgroundColor: '#f8fdfb' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-seaweed-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold mb-3" style={{ color: '#1a5d4e' }}>
              Ways to Make an Impact
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-seaweed-600 via-yellow-400 to-seaweed-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the way that works best for you to contribute to our mission
            </p>
          </div>

          {/* Help Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {helpCategories.map((category, index) => (
              <div
                key={category.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header with Icon Background */}
                <div 
                  className="h-24 sm:h-28 relative overflow-hidden flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f0f9f5 0%, #e0f2ed 100%)' }}
                >
                  <div className="text-5xl sm:text-6xl group-hover:scale-125 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                    {category.icon}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-seaweed-800 group-hover:text-seaweed-600 transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed line-clamp-4">
                    {category.description}
                  </p>

                  {/* Action Button */}
                  <Link
                    href={category.link}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
                    style={{
                      backgroundColor: '#f0f9f5',
                      color: '#1a5d4e'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1a5d4e'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f9f5'
                      e.currentTarget.style.color = '#1a5d4e'
                    }}
                  >
                    {category.buttonText}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact strip */}
      <section className="py-10 bg-gradient-to-r from-blue-400 via-green-200 to-blue-400 text-seaweed-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl">👥</div>
              <div className="font-extrabold text-xl">2,500+</div>
              <div className="text-sm opacity-90">Active Members</div>
            </div>
            <div>
              <div className="text-2xl">📅</div>
              <div className="font-extrabold text-xl">150+</div>
              <div className="text-sm opacity-90">Events</div>
            </div>
            <div>
              <div className="text-2xl">💝</div>
              <div className="font-extrabold text-xl">1M+</div>
              <div className="text-sm opacity-90">Donations</div>
            </div>
            <div>
              <div className="text-2xl">🌍</div>
              <div className="font-extrabold text-xl">10,000+</div>
              <div className="text-sm opacity-90">Lives Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (two-column cards) */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-seaweed-50 rounded-xl p-8">
                <h3 className="font-semibold text-seaweed-800 mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-50 via-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-seaweed-900 mb-4">Ready to make a difference?</h2>
          <p className="text-gray-700 mb-8">Take an action that matters — donate, join an event, or volunteer with us.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/user/donations" className="px-8 py-3 bg-seaweed-700 text-white rounded-lg font-semibold">Donate</Link>
            <Link href="/auth/register" className="px-8 py-3 border border-seaweed-200 rounded-lg text-seaweed-700">Join</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

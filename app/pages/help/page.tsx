'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function HelpPage() {
  const { data: session } = useSession()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const helpCategories = [
    {
      id: 1,
      title: 'Make a Donation',
      description: 'Support our charitable initiatives with financial contributions. Every donation directly supports families and communities in need.',
      link: '/user/donations',
      buttonText: 'Donate Now',
      icon: '💰'
    },
    {
      id: 2,
      title: 'Attend Events',
      description: 'Join our community gatherings and educational events. Connect with like-minded individuals committed to social impact.',
      link: '/user/events',
      buttonText: 'View Events',
      icon: '📅'
    },
    {
      id: 3,
      title: 'Volunteer',
      description: 'Contribute your time and skills to our community projects. Make a meaningful difference in people\'s lives.',
      link: '/auth/register',
      buttonText: 'Join Us',
      icon: '🤝'
    },
    {
      id: 4,
      title: 'Become a Member',
      description: 'Join our growing community of dedicated individuals working toward positive social change.',
      link: '/auth/register',
      buttonText: 'Register Now',
      icon: '👥'
    }
  ]

  const faqs = [
    {
      id: 1,
      question: 'How can I make a donation?',
      answer: 'Donations can be made through our secure platform. We accept multiple payment methods including M-Pesa, bank transfers, and credit card payments. All donations are processed securely and you will receive a confirmation receipt.'
    },
    {
      id: 2,
      question: 'What are the membership requirements?',
      answer: 'Membership is open to all individuals who share our mission and values. A simple registration process is required. Once registered, you gain access to all member benefits including event invitations and volunteer opportunities.'
    },
    {
      id: 3,
      question: 'What types of events do you organize?',
      answer: 'We organize educational seminars, community service projects, fundraising events, and networking gatherings. All events are designed to foster community engagement and create meaningful connections among members.'
    },
    {
      id: 4,
      question: 'How is my donation used?',
      answer: 'We maintain complete transparency in fund allocation. Donations are used for charitable programs, educational initiatives, community services, and administrative costs. Detailed financial reports are available to all members.'
    },
    {
      id: 5,
      question: 'Can I volunteer part-time?',
      answer: 'Absolutely. We offer flexible volunteering opportunities that can accommodate your schedule. Whether you can commit a few hours per month or more, we welcome your involvement.'
    },
    {
      id: 6,
      question: 'Is my personal information secure?',
      answer: 'Yes. We employ industry-standard security measures to protect all personal and financial information. Your privacy is our priority and we comply with all data protection regulations.'
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-blue-50 via-blue-100 to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Help & Support
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers to common questions and explore ways to get involved with our organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#ways-to-help" className="px-6 py-3 bg-seaweed-600 text-white rounded-lg font-semibold hover:bg-seaweed-700 transition-colors">
                Ways to Help
              </Link>
              <Link href="#faqs" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Help Section */}
      <section id="ways-to-help" className="py-16 bg-gradient-to-b from-blue-50 via-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ways to Get Involved
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              There are many ways you can contribute to our mission and make a positive impact in our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-seaweed-300"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {category.description}
                </p>
                <Link
                  href={category.link}
                  className="inline-block px-4 py-2 bg-seaweed-50 text-seaweed-700 rounded-lg font-semibold text-sm hover:bg-seaweed-100 transition-colors"
                >
                  {category.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-16 bg-gradient-to-b from-green-50 via-blue-50 to-green-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find answers to the most common questions about our organization and services.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-seaweed-600 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-seaweed-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-seaweed-100 mb-8">
            Join our community and start contributing to meaningful change today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-white text-seaweed-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/pages/about"
              className="px-8 py-3 bg-seaweed-700 text-white rounded-lg font-semibold hover:bg-seaweed-800 transition-colors border border-seaweed-700"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

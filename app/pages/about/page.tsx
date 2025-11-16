'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function AboutPage() {
  const { data: session } = useSession()

  const values = [
    {
      title: 'Compassion',
      description: 'We treat everyone with dignity and kindness in all our interactions and initiatives.',
      icon: '❤️'
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency and honesty in all our operations and financial matters.',
      icon: '✓'
    },
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in service delivery and program effectiveness.',
      icon: '⭐'
    },
    {
      title: 'Community',
      description: 'We foster strong connections and build meaningful relationships within our community.',
      icon: '🤝'
    }
  ]

  const achievements = [
    { number: '500+', label: 'Active Members' },
    { number: '50+', label: 'Events Annually' },
    { number: '10,000+', label: 'Lives Impacted' },
    { number: '100%', label: 'Transparent Giving' }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-blue-50 via-blue-100 to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Noor Ul Fityan
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A community-driven organization dedicated to creating positive social impact through charity, education, and meaningful engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 via-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-seaweed-50 to-seaweed-100 rounded-lg p-8 border border-seaweed-200">
              <h2 className="text-2xl md:text-3xl font-bold text-seaweed-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Noor Ul Fityan is dedicated to fostering community through charitable initiatives, quality education, and meaningful engagement. We believe in creating sustainable change that improves lives and strengthens our society for generations to come.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-8 border border-yellow-200">
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                We envision a world where every individual has access to quality education, support, and opportunities to thrive. Where communities are united in purpose and working together toward a more equitable and compassionate future for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 via-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and how we engage with our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-seaweed-300 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{value.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 via-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              By the numbers - the tangible impact we've made in our community.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gradient-to-br from-seaweed-50 to-seaweed-100 rounded-lg p-6 text-center border border-seaweed-200">
                <div className="text-4xl font-bold text-seaweed-700 mb-2">
                  {achievement.number}
                </div>
                <p className="text-gray-700 font-semibold text-sm">
                  {achievement.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 via-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our programs and initiatives create lasting change in our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Programs</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We provide quality educational resources and workshops to help individuals develop skills and knowledge.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="text-3xl mb-4">💝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Charitable Initiatives</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our charitable programs support families and communities in need through targeted assistance and support.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Engagement</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We foster meaningful connections and create opportunities for community members to connect and collaborate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-seaweed-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-seaweed-100 mb-8">
            Become part of an organization making a real difference in people's lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-white text-seaweed-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Involved
            </Link>
            <Link
              href="/pages/help"
              className="px-8 py-3 bg-seaweed-700 text-white rounded-lg font-semibold hover:bg-seaweed-800 transition-colors border border-seaweed-700"
            >
              Learn How to Help
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

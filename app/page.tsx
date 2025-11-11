'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, ChangeEvent, FormEvent } from 'react'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactFeedback, setContactFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const toggleDropdown = (item: string) => {
    setOpenDropdown(openDropdown === item ? null : item)
  }

  const handleContactChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (contactLoading) return

    setContactFeedback(null)

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactFeedback({ type: 'error', text: 'Please fill in your name, email, and message.' })
      return
    }

    setContactLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message')
      }

      setContactFeedback({ type: 'success', text: 'Thank you! Your message has been sent.' })
      setContactForm({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Contact form submission failed:', error)
      setContactFeedback({ type: 'error', text: 'We could not send your message. Please try again later.' })
    } finally {
      setContactLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-lg sm:text-xl font-bold text-seaweed-700 hover:text-seaweed-800 transition-colors">
                Noor Ul Fityan
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Home */}
              <Link
                href="/"
                className="text-gray-700 hover:text-seaweed-600 text-sm font-medium px-3 py-2 transition-colors"
              >
                Home
              </Link>
              
              {/* Our Impact */}
              <Link
                href="/#impact"
                className="text-gray-700 hover:text-seaweed-600 text-sm font-medium px-3 py-2 transition-colors"
              >
                Our Impact
              </Link>

              {/* About Us */}
              <div className="relative group">
                <Link
                  href="#about"
                  className="text-gray-700 hover:text-seaweed-600 text-sm font-medium px-3 py-2 transition-colors"
                  onMouseEnter={() => toggleDropdown('about')}
                >
                  About Us
                </Link>
                {openDropdown === 'about' && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseLeave={() => setOpenDropdown(null)}
                    onMouseEnter={() => setOpenDropdown('about')}
                  >
                    <Link href="#about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-seaweed-50 hover:text-seaweed-600 transition-colors">Mission & Values</Link>
                  </div>
                )}
              </div>

              {/* Get Involved */}
              <div className="relative group">
                <Link
                  href="#get-involved"
                  className="text-gray-700 hover:text-seaweed-600 text-sm font-medium px-3 py-2 transition-colors"
                  onMouseEnter={() => toggleDropdown('get-involved')}
                >
                  Get Involved
                </Link>
                {openDropdown === 'get-involved' && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseLeave={() => setOpenDropdown(null)}
                    onMouseEnter={() => setOpenDropdown('get-involved')}
                  >
                    <Link href="#get-involved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-seaweed-50 hover:text-seaweed-600 transition-colors">Ways to Help</Link>
                    <Link href="/user/donations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-seaweed-50 hover:text-seaweed-600 transition-colors">Make a Donation</Link>
                    <Link href="/user/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-seaweed-50 hover:text-seaweed-600 transition-colors">Attend Events</Link>
                    <Link href="/auth/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-seaweed-50 hover:text-seaweed-600 transition-colors">Join Community</Link>
                  </div>
                )}
              </div>

              {/* News & Events */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('news')}
                  className="text-gray-700 hover:text-seaweed-600 text-sm font-medium px-3 py-2 transition-colors"
                >
                  News & Events
                </button>
                {openDropdown === 'news' && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link href="/user/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-seaweed-50 hover:text-seaweed-600 transition-colors">Upcoming Events</Link>
                    <Link href="/admin/news" className="block px-4 py-2 text-sm text-gray-700 hover:bg-seaweed-50 hover:text-seaweed-600 transition-colors">News & Updates</Link>
                  </div>
                )}
              </div>

              {/* Contact */}
              <Link href="#contact" className="text-gray-700 hover:text-seaweed-600 text-sm font-medium px-3 py-2 transition-colors">
                Contact
              </Link>
            </div>

            {/* Right Side: Donate Button + Mobile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {session && (
                <Link
                  href="/user/profile"
                  className="hidden sm:inline-block px-3 py-1.5 text-xs sm:text-sm font-semibold text-seaweed-700 border border-seaweed-400 rounded-lg hover:bg-seaweed-600 hover:text-white transition-colors"
                >
                  {session.user?.name ? `${session.user.name.split(' ')[0]}'s Profile` : 'My Profile'}
                </Link>
              )}
              {/* Donate Button - Always visible */}
              <Link
                href="/user/donations"
                className="bg-yellow-400 text-seaweed-900 px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 animate-pulse-glow border-2 border-yellow-300"
              >
                💝 Donate
              </Link>

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-seaweed-600 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-white z-40 overflow-y-auto">
              <div className="px-4 py-4 space-y-1">
                {/* Home */}
                <Link
                  href="/"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-seaweed-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                
                {/* Our Impact */}
                <Link
                  href="/#impact"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-seaweed-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Our Impact
                </Link>

                {/* About Us */}
                <div>
                  <Link
                    href="#about"
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-seaweed-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                </div>

                {/* Get Involved */}
                <div>
                  <Link
                    href="#get-involved"
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-seaweed-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Involved
                  </Link>
                </div>

                {/* News & Events */}
                <div>
                  <button
                    onClick={() => toggleDropdown('mobile-news')}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-seaweed-50 rounded-lg transition-colors"
                  >
                    News & Events
                    <span className="text-xs">{openDropdown === 'mobile-news' ? '▲' : '▼'}</span>
                  </button>
                  {openDropdown === 'mobile-news' && (
                    <div className="pl-4 space-y-1">
                      <Link href="/user/events" className="block px-4 py-3 text-sm text-gray-600 hover:bg-seaweed-50 rounded-lg transition-colors">Upcoming Events</Link>
                      <Link href="/admin/news" className="block px-4 py-3 text-sm text-gray-600 hover:bg-seaweed-50 rounded-lg transition-colors">News & Updates</Link>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <Link href="#contact" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-seaweed-50 rounded-lg transition-colors">
                  Contact
                </Link>

                {session && (
                  <Link
                    href="/user/profile"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-seaweed-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                )}

                {/* Sign In / Dashboard */}
                {session ? (
                  <Link
                    href="/user"
                    className="block px-4 py-3 text-base font-medium text-seaweed-600 hover:bg-seaweed-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/auth/login" className="block px-4 py-3 text-base font-medium text-seaweed-600 hover:bg-seaweed-50 rounded-lg transition-colors">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Overlay - Energetic */}
      <section id="home" className="relative pt-14 sm:pt-16 pb-8 sm:pb-10 overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #1a5d4e 0%, #2d9474 50%, #1a5d4e 100%)',
        backgroundSize: '200% 200%'
      }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-float opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-bounce-slow opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-seaweed-400 rounded-full blur-3xl animate-rotate-slow opacity-10" style={{ transform: 'translate(-50%, -50%)' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center">
            {/* Text Content - Left Column on Desktop */}
            <div className="text-center md:text-left animate-slide-up order-1 md:order-1">
            <div className="inline-block mb-1.5 px-2.5 py-1 sm:px-3 sm:py-1 bg-yellow-400 bg-opacity-30 rounded-full border-2 border-yellow-300 animate-pulse-glow shadow-md">
              <span className="text-yellow-200 text-xs font-bold animate-bounce-slow inline-block">🕌</span>
              <span className="text-yellow-200 text-xs font-bold ml-1">Islamic Community Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-1.5 tracking-tight animate-slide-up" style={{ 
              color: 'white', 
              textShadow: '3px 3px 6px rgba(0,0,0,0.4), 0 0 30px rgba(250, 204, 21, 0.3)',
              background: 'linear-gradient(45deg, #ffffff, #facc15, #ffffff)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-shift 3s ease infinite'
            }}>
              Noor Ul Fityan
            </h1>
            <div className="w-16 sm:w-20 h-0.5 bg-yellow-400 mx-auto md:mx-0 mb-1 sm:mb-1.5 rounded-full animate-pulse-glow shadow-md"></div>
            <p className="text-sm sm:text-base md:text-lg mb-1 sm:mb-1.5 font-bold animate-slide-up" style={{ 
              color: 'white', 
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animationDelay: '0.2s'
            }}>
              Unity, Growth, and Good Deeds for the Sake of Allah
            </p>
            <p className="text-xs sm:text-sm max-w-3xl mx-auto md:mx-0 mb-2 sm:mb-3 leading-relaxed animate-slide-up" style={{ 
              color: '#e8f5e9',
              animationDelay: '0.4s'
            }}>
              We provide charity support, spiritual guidance, and community services to help those in need 
              and foster unity among Muslims. Every donation and act of service brings us closer to Allah's mercy.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start mt-2 sm:mt-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Link 
                href="/auth/register"
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all font-bold text-xs sm:text-sm border-2 border-white shadow-lg hover:shadow-white/50 hover:scale-105 transform duration-300"
              >
                Join Our Community
              </Link>
              <Link 
                href="#get-involved"
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-seaweed-600 bg-opacity-80 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-100 transition-all font-bold text-xs sm:text-sm border-2 border-seaweed-400 shadow-lg hover:shadow-seaweed-400/50 hover:scale-105 transform duration-300"
              >
                Get Involved
              </Link>
            </div>
            </div>
            
            {/* Image - Right Column on Desktop */}
            <div className="relative animate-slide-up order-2 md:order-2" style={{ animationDelay: '0.3s' }}>
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg border-2 border-yellow-400">
                <Image
                  src="/images/noor1.jpeg"
                  alt="Noor Ul Fityan Community"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L60 90C120 80 240 60 360 55C480 50 600 60 720 65C840 70 960 70 1080 65C1200 60 1320 50 1380 45L1440 40V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section id="impact" className="py-4 sm:py-6 bg-gradient-to-br from-seaweed-50 to-yellow-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1" style={{ color: '#1a5d4e' }}>
              Our Impact
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-yellow-400 mx-auto mb-1 rounded-full"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
              Real numbers showing the difference we're making together
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-3">
            <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow border-l-2 sm:border-l-3 border-seaweed-500">
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-0.5" style={{ color: '#1a5d4e' }}>15+</div>
              <div className="text-xs text-gray-600 font-medium">Active Members</div>
              <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">Growing community</div>
            </div>
            <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow border-l-2 sm:border-l-3 border-yellow-500">
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-0.5" style={{ color: '#facc15' }}>3+</div>
              <div className="text-xs text-gray-600 font-medium">Events Organized</div>
              <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">Charity & community</div>
            </div>
            <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow border-l-2 sm:border-l-3 border-seaweed-600">
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-0.5" style={{ color: '#2d9474' }}>$50+</div>
              <div className="text-xs text-gray-600 font-medium">Donations Received</div>
              <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">Making a difference</div>
            </div>
            <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow border-l-2 sm:border-l-3 border-yellow-600">
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-0.5" style={{ color: '#ca8a04' }}>25+</div>
              <div className="text-xs text-gray-600 font-medium">Lives Impacted</div>
              <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">Through our work</div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-md border border-seaweed-200">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-0.5">Registered Charity</div>
                <div className="text-xs sm:text-sm font-semibold text-seaweed-700">501(c)(3) Status</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-0.5">Secure Payments</div>
                <div className="flex items-center gap-1 sm:gap-2 justify-center mt-0.5">
                  <span className="text-sm sm:text-lg">🔒</span>
                  <span className="text-xs sm:text-sm font-semibold text-seaweed-700">SSL Encrypted</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-0.5">Payment Methods</div>
                <div className="flex items-center gap-1 sm:gap-2 justify-center mt-0.5">
                  <span className="text-xs sm:text-sm">💳</span>
                  <span className="text-xs sm:text-sm font-semibold text-seaweed-700">Visa • MC • PayPal</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-0.5">Transparency</div>
                <div className="text-xs sm:text-sm font-semibold text-seaweed-700">100% Accountable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" className="py-4 sm:py-6 md:py-8 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1" style={{ color: '#1a5d4e' }}>
              What We Stand For
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-yellow-400 mx-auto mb-1 rounded-full"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
              The core values that drive everything we do at Noor Ul Fityan
            </p>
          </div>
          
          {/* Content with Image on Right */}
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-center mb-4 sm:mb-6">
            {/* Text Content - Left Aligned */}
            <div className="space-y-3 sm:space-y-4 animate-slide-up text-left">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold mb-2 text-left" style={{ color: '#1a5d4e' }}>
                  Our Mission
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 text-left">
                  At Noor Ul Fityan, we are dedicated to fostering unity, growth, and good deeds within our Muslim community. 
                  We believe that together, we can make a lasting positive impact for the sake of Allah.
                </p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-left">
                  Through charity activities, spiritual guidance, and community support, we strive to create a platform where 
                  every member can contribute to meaningful causes and grow both personally and spiritually.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="text-center p-2 sm:p-3 bg-seaweed-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-1">🤝</div>
                  <div className="text-xs sm:text-sm font-bold text-seaweed-700">Unity</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-1">🌱</div>
                  <div className="text-xs sm:text-sm font-bold text-yellow-700">Growth</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-seaweed-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-1">❤️</div>
                  <div className="text-xs sm:text-sm font-bold text-seaweed-700">Good Deeds</div>
                </div>
              </div>
            </div>
            
            {/* Featured Image - Right Aligned */}
            <div className="animate-slide-up flex justify-end md:justify-end" style={{ animationDelay: '0.2s' }}>
              <div className="relative rounded-lg overflow-hidden shadow-md sm:shadow-lg border-2 border-seaweed-300 max-w-full">
                <Image
                  src="/images/noor2.jpeg"
                  alt="Noor Ul Fityan Community Activities"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="get-involved" className="py-4 sm:py-6 md:py-8 relative" style={{ backgroundColor: '#f0f9f5' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-seaweed-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1" style={{ color: '#1a5d4e' }}>
              How You Can Help
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-yellow-400 mx-auto mb-1 rounded-full"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
              Join us in making a positive impact through various ways to contribute
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {/* Featured Image for Get Involved Section */}
            <div className="relative rounded-lg overflow-hidden shadow-md sm:shadow-lg border-2 border-yellow-300 animate-slide-up group hover:shadow-xl transition-shadow">
              <Image
                src="/images/noor3.jpeg"
                alt="Noor Ul Fityan Community Engagement"
                width={600}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-seaweed-900/80 to-transparent flex items-end p-2 sm:p-3 md:p-4">
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-0.5">Join Our Community</h3>
                  <p className="text-white/90 text-xs">Together we make a difference</p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Stacked Cards */}
            <div className="space-y-2 sm:space-y-3">
              {/* Make a Donation - First Card */}
              <div className="group bg-white p-2 sm:p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up" style={{ 
                borderTop: '2px solid #2d9474',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0f9f5 100%)',
                animationDelay: '0.2s'
              }}>
                <div className="flex items-start mb-1">
                  <div className="p-1 rounded-md mr-1.5 animate-bounce-slow shadow-sm" style={{ backgroundColor: '#f0f9f5' }}>
                    <span className="text-lg sm:text-xl animate-float">🕌</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs sm:text-sm font-bold mb-0.5 group-hover:text-seaweed-600 transition-colors" style={{ color: '#1a5d4e' }}>
                      Make a Donation
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      Support our charity initiatives with financial contributions. Every donation helps us provide 
                      food, clothing, educational support, and financial assistance to those in need.
                    </p>
                    <Link href="/user/donations" className="inline-block mt-0.5 text-seaweed-600 hover:text-seaweed-700 font-medium text-xs">
                      Donate Now →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Attend Events - Second Card */}
              <div className="group bg-white p-2 sm:p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up" style={{ 
                borderTop: '2px solid #facc15',
                background: 'linear-gradient(180deg, #ffffff 0%, #fefce8 100%)',
                animationDelay: '0.3s'
              }}>
                <div className="flex items-start mb-1">
                  <div className="p-1 rounded-md mr-1.5 animate-bounce-slow shadow-sm" style={{ backgroundColor: '#fefce8' }}>
                    <span className="text-lg sm:text-xl animate-float" style={{ animationDelay: '0.3s' }}>📿</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs sm:text-sm font-bold mb-0.5 group-hover:text-seaweed-600 transition-colors" style={{ color: '#1a5d4e' }}>
                      Attend Events
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      Join our spiritual gatherings, study circles, and community events. Participate in 
                      charity activities and connect with fellow community members.
                    </p>
                    <Link href="/user/events" className="inline-block mt-0.5 text-seaweed-600 hover:text-seaweed-700 font-medium text-xs">
                      View Events →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Spread the Word - Third Card */}
              <div className="group bg-white p-2 sm:p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up" style={{ 
                borderTop: '2px solid #1a5d4e',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0f9f5 100%)',
                animationDelay: '0.4s'
              }}>
                <div className="flex items-start mb-1">
                  <div className="p-1 rounded-md mr-1.5 animate-bounce-slow shadow-sm" style={{ backgroundColor: '#f0f9f5' }}>
                    <span className="text-lg sm:text-xl animate-float" style={{ animationDelay: '0.6s' }}>👥</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs sm:text-sm font-bold mb-0.5 group-hover:text-seaweed-600 transition-colors" style={{ color: '#1a5d4e' }}>
                      Spread the Word
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      Help us grow our community by sharing our mission with others. Follow us on social media, 
                      invite friends and family, and help amplify our impact.
                    </p>
                    <Link href="/auth/register" className="inline-block mt-0.5 text-seaweed-600 hover:text-seaweed-700 font-medium text-xs">
                      Get Started →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Volunteer - Fourth Card */}
              <div className="group bg-white p-2 sm:p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up" style={{ 
                borderTop: '2px solid #1f7560',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0f9f5 100%)',
                animationDelay: '0.5s'
              }}>
                <div className="flex items-start mb-1">
                  <div className="p-1 rounded-md mr-1.5 animate-bounce-slow shadow-sm" style={{ backgroundColor: '#f0f9f5' }}>
                    <span className="text-lg sm:text-xl animate-float" style={{ animationDelay: '0.9s' }}>🌍</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs sm:text-sm font-bold mb-0.5 group-hover:text-seaweed-600 transition-colors" style={{ color: '#1a5d4e' }}>
                      Volunteer
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      Volunteer your time and skills for community projects, environmental initiatives, and social 
                      causes. Your involvement makes a real difference in people's lives.
                    </p>
                    <Link href="/auth/register" className="inline-block mt-0.5 text-seaweed-600 hover:text-seaweed-700 font-medium text-xs">
                      Join Us →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-6 sm:py-8 md:py-10 overflow-hidden" style={{ backgroundColor: '#1a5d4e' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-seaweed-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-yellow-400 bg-opacity-20 rounded-full border border-yellow-300">
            <span className="text-yellow-300 text-xs font-semibold">🌟 Join Thousands of Members</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1.5" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Ready to Make a Difference?
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-yellow-400 mx-auto mb-1.5 rounded-full"></div>
          <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed max-w-2xl mx-auto px-4" style={{ color: '#e8f5e9' }}>
            Join hundreds of members who are making a real impact in their communities. Every contribution, 
            big or small, brings us closer to our goal of serving Allah through charity and unity.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3 sm:mb-4 px-4">
            <Link 
              href="/user/donations"
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-yellow-400 text-seaweed-900 rounded-lg hover:bg-yellow-300 transition-all font-bold text-xs sm:text-sm shadow-lg hover:shadow-yellow-400/50 hover:scale-105 transform duration-300 animate-pulse-glow border-2 border-yellow-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-1">
                <span className="animate-bounce-slow">💝</span>
                Donate Now
                <span className="animate-bounce-slow" style={{ animationDelay: '0.2s' }}>→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="/auth/register"
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all font-bold text-xs sm:text-sm border-2 border-white shadow-lg hover:shadow-white/50 hover:scale-105 transform duration-300"
            >
              Join Our Community
            </Link>
            <Link 
              href="/user/events"
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-seaweed-600 bg-opacity-80 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-100 transition-all font-bold text-xs sm:text-sm border-2 border-seaweed-400 shadow-lg hover:shadow-seaweed-400/50 hover:scale-105 transform duration-300"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-4 sm:py-6 md:py-8 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1" style={{ color: '#1a5d4e' }}>
              Get In Touch
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-yellow-400 mx-auto mb-1 rounded-full"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
              Have questions or want to get involved? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Contact Information */}
            <div className="bg-gradient-to-br from-seaweed-50 to-yellow-50 p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: '#1a5d4e' }}>
                Contact Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start">
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">👤</span>
                  <div>
                    <div className="font-semibold text-sm sm:text-base text-gray-800">Abdallah Abdul</div>
                    <div className="text-xs sm:text-sm text-gray-600">Chairman</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">📞</span>
                  <a href="tel:+254768209816" className="text-sm sm:text-base text-gray-700 hover:text-seaweed-600 transition-colors">
                    +254 768 209 816
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">✉️</span>
                  <a href="mailto:abdallahbinabdul001@gmail.com" className="text-sm sm:text-base text-gray-700 hover:text-seaweed-600 transition-colors">
                    abdallahbinabdul001@gmail.com
                  </a>
                </div>
                <div className="flex items-center pt-2">
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🌐</span>
                  <div className="flex gap-2 sm:gap-3">
                    <a href="#" className="text-lg sm:text-xl hover:scale-110 transition-transform" aria-label="Facebook">📘</a>
                    <a href="#" className="text-lg sm:text-xl hover:scale-110 transition-transform" aria-label="Instagram">📷</a>
                    <a href="#" className="text-lg sm:text-xl hover:scale-110 transition-transform" aria-label="Twitter">🐦</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: '#1a5d4e' }}>
                Send Us a Message
              </h3>
              <form className="space-y-3 sm:space-y-4" onSubmit={handleContactSubmit}>
                {contactFeedback && (
                  <div
                    className={`rounded-md px-3 py-2 text-sm ${
                      contactFeedback.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    {contactFeedback.text}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                    placeholder="Enter your name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    disabled={contactLoading}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                    placeholder="Enter your email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    disabled={contactLoading}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                    placeholder="Enter your message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    disabled={contactLoading}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={contactLoading}
                  className={`w-full px-4 py-2.5 bg-seaweed-600 text-white rounded-lg transition-colors font-semibold text-sm shadow-md ${
                    contactLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-seaweed-700 hover:shadow-lg'
                  }`}
                >
                  {contactLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-seaweed-900 text-white py-3 sm:py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2">Noor Ul Fityan</h3>
              <p className="text-seaweed-300 text-xs">
                Unity, Growth, and Good Deeds for the Sake of Allah. 
                Building a stronger Muslim community through charity and service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1.5 sm:mb-2 text-xs sm:text-sm">Quick Links</h4>
              <ul className="space-y-1 text-xs text-seaweed-300">
                <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#impact" className="hover:text-white transition-colors">Our Impact</Link></li>
                <li><Link href="#get-involved" className="hover:text-white transition-colors">Get Involved</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1.5 sm:mb-2 text-xs sm:text-sm">Ways to Help</h4>
              <ul className="space-y-1 text-xs text-seaweed-300">
                <li><Link href="/user/donations" className="hover:text-white transition-colors">Donate Now</Link></li>
                <li><Link href="/user/events" className="hover:text-white transition-colors">Attend Events</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Join Community</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Volunteer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1.5 sm:mb-2 text-xs sm:text-sm">Contact</h4>
              <ul className="space-y-1 text-xs text-seaweed-300">
                <li className="font-medium text-white">Abdallah Abdul</li>
                <li className="text-seaweed-400">Chairman</li>
                <li>Phone: +254 768 209 816</li>
                <li>Email: abdallahbinabdul001@gmail.com</li>
                <li className="mt-1.5 sm:mt-2">
                  <div className="flex gap-2">
                    <a href="#" className="hover:text-white transition-colors text-xs">📘</a>
                    <a href="#" className="hover:text-white transition-colors text-xs">📷</a>
                    <a href="#" className="hover:text-white transition-colors text-xs">🐦</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 md:mt-5 pt-3 sm:pt-4 md:pt-5 border-t border-seaweed-800 text-center text-xs text-seaweed-400">
            <p>&copy; {new Date().getFullYear()} Noor Ul Fityan. All rights reserved. | Registered Charity 501(c)(3)</p>
          </div>
        </div>
      </footer>
    </main>
  )
}


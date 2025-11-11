'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error responses
        toast.error(data.error || 'Failed to send reset link')
        return
      }

      if (data.success) {
        setSent(true)
        toast.success('Password reset link sent! Please check your email.')
      } else {
        toast.error(data.error || 'Failed to send reset link')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-seaweed-50 to-seaweed-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-seaweed-800 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              onClick={(e) => {
                if (!email) {
                  e.preventDefault()
                  toast.error('Please enter your email address')
                }
              }}
              disabled={submitting || !email}
              className="w-full bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-seaweed-600 hover:text-seaweed-700 font-medium text-sm"
              >
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-seaweed-600 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              The link will expire in 1 hour. If you didn't receive the email, please check your spam folder.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}


'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      toast.error('Invalid reset link')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!token) {
      toast.error('Invalid reset token')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        toast.success('Password reset successfully!')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        setStatus('error')
        toast.error(data.error || 'Failed to reset password')
      }
    } catch (error) {
      setStatus('error')
      toast.error('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-seaweed-50 to-seaweed-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">Your password has been reset. Redirecting to login...</p>
          <Link
            href="/auth/login"
            className="inline-block bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'error' && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-seaweed-50 to-seaweed-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
          <Link
            href="/auth/forgot-password"
            className="inline-block bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-seaweed-50 to-seaweed-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-seaweed-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Resetting...' : 'Reset Password'}
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
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-seaweed-50 to-seaweed-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-seaweed-600 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}


'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'idle'>('idle')
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('No verification token provided')
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    setStatus('verifying')
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage('Email verified successfully! You can now log in.')
        toast.success('Email verified successfully!')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to verify email')
        toast.error(data.error || 'Failed to verify email')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while verifying your email')
      toast.error('An error occurred while verifying your email')
    }
  }

  const resendVerification = async () => {
    const email = prompt('Please enter your email address:')
    if (!email) return

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Verification email sent! Please check your inbox.')
      } else {
        toast.error(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-seaweed-50 to-seaweed-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-seaweed-800 mb-2">Email Verification</h1>
          <p className="text-gray-600">Verifying your email address...</p>
        </div>

        {status === 'verifying' && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-seaweed-600 mb-4"></div>
            <p className="text-gray-600">Please wait...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/auth/login"
              className="inline-block bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={resendVerification}
                className="w-full bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
              >
                Resend Verification Email
              </button>
              <Link
                href="/auth/login"
                className="block text-center text-seaweed-600 hover:text-seaweed-700 font-medium"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  )
}


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')

    console.log('Form submitted with data:', {
      email: formData.email,
      passwordLength: formData.password.length,
      confirmPasswordLength: formData.confirmPassword.length,
    })

    // Validate required fields
    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }

    if (!formData.password.trim()) {
      setError('Password is required')
      return
    }

    if (!formData.confirmPassword.trim()) {
      setError('Please confirm your password')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      console.log('Submitting registration for:', formData.email)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()
      console.log('Registration response:', data)

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Registration failed'
        const errorDetails = data.details ? ` Details: ${Array.isArray(data.details) ? data.details.join(', ') : data.details}` : ''
        setError(errorMessage + errorDetails)
        setLoading(false)
        return
      }

      // Show email verification message
      if (data.success && data.emailSent) {
        setEmailSent(true)
      } else if (data.success) {
        // User created but email not sent - show success and redirect
        setEmailSent(true)
        setTimeout(() => {
          router.push('/auth/login?registered=true')
        }, 3000)
      } else {
        setError(data.error || 'Registration failed')
      }
      setLoading(false)
    } catch (error) {
      console.error('Registration error:', error)
      setError('An error occurred. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-seaweed-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">Noor Ul Fityan</h1>
            <p className="text-seaweed-600 text-sm">Unity, Growth, and Good Deeds</p>
          </div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-seaweed-800">
            Join Our Community
          </h2>
          <p className="mt-2 text-center text-sm text-seaweed-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-seaweed-600 hover:text-seaweed-700">
              sign in to existing account
            </Link>
          </p>
        </div>
        {emailSent ? (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">Registration Successful!</h3>
            <p className="text-green-700 mb-4">
              We've sent a verification email to <strong>{formData.email}</strong>. Please check your inbox and click the verification link to activate your account.
            </p>
            <p className="text-sm text-green-600 mb-4">
              The verification link will expire in 24 hours.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Name (optional)"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowPassword(!showPassword)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 z-20 cursor-pointer bg-transparent"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowConfirmPassword(!showConfirmPassword)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 z-20 cursor-pointer bg-transparent"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-seaweed-600 hover:bg-seaweed-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seaweed-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
              onClick={(e) => {
                console.log('Button clicked!', {
                  loading,
                  email: formData.email.trim(),
                  password: formData.password.trim(),
                  confirmPassword: formData.confirmPassword.trim(),
                  disabled: loading || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()
                })
                
                // Double-check validation on click
                if (loading || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
                  e.preventDefault()
                  e.stopPropagation()
                  setError('Please fill in all required fields (email, password, and confirm password)')
                  return false
                }
              }}
            >
              {loading ? 'Creating account...' : 'Join Noor Ul Fityan'}
            </button>
            {(!formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) && !loading && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        </form>
        )}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}


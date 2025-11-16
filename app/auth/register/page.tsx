"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('Please fill in all required fields')
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }
      if (data.success) {
        setEmailSent(true)
        setTimeout(() => router.push('/auth/login?registered=true'), 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-blue-50 via-green-50 to-blue-50 rounded-3xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col gap-4">
                <h1 className="text-2xl md:text-3xl font-extrabold text-seaweed-900">Create your account</h1>
                <p className="text-gray-700">Join Noor Ul Fityan to donate, attend events, and volunteer — be part of a growing community focused on service and unity.</p>
                <div className="mt-4">
                  <Link href="/" className="text-sm text-gray-600 hover:text-seaweed-800">← Back to home</Link>
                </div>
                <div className="mt-auto">
                  <p className="text-xs text-gray-600">Already have an account? <Link href="/auth/login" className="font-semibold text-seaweed-700 hover:underline">Sign in</Link></p>
                </div>
              </div>

              <div className="p-6 md:p-10 bg-white">
                {emailSent ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">📧</div>
                    <h3 className="text-lg font-bold text-green-800 mb-2">Registration Successful!</h3>
                    <p className="text-green-700 mb-4">We've sent a verification email to <strong>{formData.email}</strong>. Please check your inbox to activate your account.</p>
                    <Link href="/auth/login" className="inline-block bg-seaweed-700 text-white px-5 py-2 rounded-lg">Go to Login</Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">{error}</div>}
                    <div>
                      <label className="sr-only" htmlFor="name">Name</label>
                      <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full name (optional)" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-seaweed-200 focus:border-seaweed-300" />
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="email">Email</label>
                      <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@domain.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-seaweed-200 focus:border-seaweed-300" />
                    </div>
                    <div className="relative">
                      <label className="sr-only" htmlFor="password">Password</label>
                      <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} placeholder="Password (min 6 chars)" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-seaweed-200 focus:border-seaweed-300 pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    <div className="relative">
                      <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
                      <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-seaweed-200 focus:border-seaweed-300 pr-10" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{showConfirmPassword ? 'Hide' : 'Show'}</button>
                    </div>

                    <div>
                      <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-seaweed-700 text-white rounded-lg font-semibold disabled:opacity-60">{loading ? 'Creating account...' : 'Create account'}</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


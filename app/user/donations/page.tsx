'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Donation {
  id: string
  amount: number
  type: string
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export default function DonationsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'donate' | 'history'>('donate')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('charity')
  const [description, setDescription] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'manual'>('mpesa')

  useEffect(() => {
    if (activeTab === 'history') {
      fetchDonationHistory()
    }
  }, [activeTab])

  const fetchDonationHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await fetch('/api/user/donations')
      const data = await res.json()
      if (data.success) {
        setDonations(data.donations)
      }
    } catch (err) {
      toast.error('Failed to load donation history')
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate M-Pesa phone number if M-Pesa is selected
      if (paymentMethod === 'mpesa') {
        if (!phoneNumber || phoneNumber.length < 10) {
          toast.error('Please enter a valid M-Pesa phone number')
          setLoading(false)
          return
        }
      }

      // Create donation
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          type,
          description,
          paymentMethod: paymentMethod,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // If M-Pesa payment method, initiate payment
        if (paymentMethod === 'mpesa' && phoneNumber) {
          try {
            const mpesaResponse = await fetch('/api/payments/mpesa/initiate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                donationId: data.donation.id,
                phoneNumber: phoneNumber,
              }),
            })

            const mpesaData = await mpesaResponse.json()

            if (mpesaData.success) {
              toast.success(mpesaData.message || 'M-Pesa payment request sent! Please check your phone to complete the payment.')
              // Refresh history to show the new donation with pending status
              if (activeTab === 'history') {
                setTimeout(() => fetchDonationHistory(), 1000)
              }
            } else {
              toast.error(mpesaData.error || 'Donation created but M-Pesa payment failed. Please try again.')
            }
          } catch (mpesaError) {
            toast.error('Donation created but M-Pesa payment failed. Please contact support.')
          }
        } else {
          toast.success('Donation submitted successfully! May Allah accept it from you.')
        }

        setAmount('')
        setDescription('')
        setPhoneNumber('')
        
        // Refresh history if on history tab
        if (activeTab === 'history') {
          fetchDonationHistory()
        }
      } else {
        toast.error(data.error || 'Failed to submit donation')
      }
    } catch (error) {
      toast.error('Error submitting donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = (donation: Donation) => {
    // Simple receipt generation
    const receipt = `
DONATION RECEIPT
Noor Ul Fityan

Receipt ID: ${donation.id}
Date: ${new Date(donation.createdAt).toLocaleDateString()}
Time: ${new Date(donation.createdAt).toLocaleTimeString()}

Donor: ${session?.user?.name || session?.user?.email}
Email: ${session?.user?.email}

Amount: $${donation.amount.toFixed(2)}
Type: ${donation.type.charAt(0).toUpperCase() + donation.type.slice(1)}
Status: ${donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
${donation.description ? `Description: ${donation.description}` : ''}

Thank you for your generous contribution.
May Allah reward you abundantly.

---
This is a computer-generated receipt.
For official receipt, please contact:
Abdallah Abdul, Chairman
Phone: +254 768 209 816
Email: info@noorulfityan.org
    `.trim()

    const blob = new Blob([receipt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donation-receipt-${donation.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Receipt downloaded')
  }

  const totalDonated = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">Donations</h1>
        <p className="text-base text-seaweed-600">
          Support our charity activities and community initiatives for the sake of Allah.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex bg-white rounded-lg p-1 shadow-md border border-gray-200 inline-flex">
          <button
            type="button"
            onClick={() => setActiveTab('donate')}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'donate'
                ? 'bg-seaweed-600 text-white shadow-md'
                : 'text-gray-700 hover:text-seaweed-600'
            }`}
          >
            💝 Make Donation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-seaweed-600 text-white shadow-md'
                : 'text-gray-700 hover:text-seaweed-600'
            }`}
          >
            📋 Donation History
          </button>
        </div>
      </div>

      {/* Donate Tab */}
      {activeTab === 'donate' && (
        <div className="max-w-2xl">
          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-yellow-500">
            <div className="mb-4 text-center">
              <span className="text-4xl mb-3 block">💝</span>
              <p className="text-gray-700 text-sm">
                "And whatever you spend in charity or devotion, be sure Allah knows it all." - Quran 2:273
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount (USD)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                >
                  <option value="charity">Charity (General)</option>
                  <option value="event">Event Support</option>
                  <option value="spiritual">Spiritual Activities</option>
                  <option value="community">Community Projects</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                  placeholder="Any additional notes or specific purpose for this donation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-seaweed-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'mpesa' | 'manual')}
                      className="mr-3 text-seaweed-600 focus:ring-seaweed-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">M-Pesa</div>
                      <div className="text-xs text-gray-500">Pay instantly via M-Pesa</div>
                    </div>
                    <span className="text-2xl ml-2">📱</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-seaweed-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="manual"
                      checked={paymentMethod === 'manual'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'mpesa' | 'manual')}
                      className="mr-3 text-seaweed-600 focus:ring-seaweed-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Manual Payment</div>
                      <div className="text-xs text-gray-500">Pay later or contact us directly</div>
                    </div>
                    <span className="text-2xl ml-2">💳</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'mpesa' && (
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    required={paymentMethod === 'mpesa'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
                    placeholder="254712345678 or 0712345678"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your M-Pesa registered phone number. You'll receive a payment prompt on your phone.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-seaweed-600 text-white px-6 py-3 rounded-lg hover:bg-seaweed-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (paymentMethod === 'mpesa' ? 'Processing...' : 'Submitting...') : paymentMethod === 'mpesa' ? 'Pay with M-Pesa' : 'Submit Donation'}
              </button>
            </form>

            <div className="mt-8 p-4 bg-seaweed-50 rounded-lg">
              <p className="text-sm text-seaweed-700">
                <strong>Note:</strong> All donations are processed securely. Your contribution supports 
                our charity activities, community projects, and spiritual initiatives. May Allah reward 
                you abundantly for your generosity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {loadingHistory ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-seaweed-600 mx-auto mb-4"></div>
              <p className="text-seaweed-600">Loading donation history...</p>
            </div>
          ) : (
            <>
              {donations.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-4 mb-6 border-l-4 border-seaweed-500">
                  <p className="text-sm text-gray-600">
                    Total Donated: <span className="font-bold text-seaweed-600 text-lg">${totalDonated.toFixed(2)}</span>
                  </p>
                </div>
              )}

              {donations.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">💝</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No donations yet</h3>
                  <p className="text-gray-600 mb-4">Start making a difference today!</p>
                  <button
                    onClick={() => setActiveTab('donate')}
                    className="px-6 py-2 bg-seaweed-600 text-white rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
                  >
                    Make Your First Donation
                  </button>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-seaweed-200 bg-seaweed-50">
                    <h2 className="text-lg font-bold text-seaweed-800">Your Donation History</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {donations.map((donation) => (
                          <tr key={donation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(donation.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-seaweed-600">
                              ${donation.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-seaweed-100 text-seaweed-800">
                                {donation.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                donation.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : donation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {donation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {donation.status === 'completed' && (
                                <button
                                  onClick={() => downloadReceipt(donation)}
                                  className="text-seaweed-600 hover:text-seaweed-900"
                                >
                                  Download Receipt
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

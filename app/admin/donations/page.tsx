'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/app/components/Modal'

interface Donation {
  id: string
  amount: number
  type: string
  description: string | null
  status: string
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [updating, setUpdating] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchDonations()
  }, [statusFilter, typeFilter, searchQuery])

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true)
    try {
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'donations',
          format,
          filters: {
            status: statusFilter !== 'all' ? statusFilter : undefined,
            type: typeFilter !== 'all' ? typeFilter : undefined,
          },
        }),
      })

      if (format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Donations exported successfully')
      } else {
        const data = await response.json()
        if (data.success) {
          const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
          toast.success('Donations exported successfully')
        }
      }
    } catch (error) {
      toast.error('Failed to export donations')
    } finally {
      setExporting(false)
    }
  }

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`/api/admin/donations?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setDonations(data.donations)
      }
    } catch (err) {
      console.error('Error fetching donations:', err)
      toast.error('Failed to load donations')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedDonation || !newStatus) return

    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/donations/${selectedDonation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Donation status updated successfully')
        setIsStatusModalOpen(false)
        setSelectedDonation(null)
        fetchDonations()
      } else {
        toast.error(data.error || 'Failed to update donation status')
      }
    } catch (error) {
      toast.error('Error updating donation status')
    } finally {
      setUpdating(false)
    }
  }

  const openStatusModal = (donation: Donation) => {
    setSelectedDonation(donation)
    setNewStatus(donation.status)
    setIsStatusModalOpen(true)
  }

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0)
  const completedAmount = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0)
  const pendingAmount = donations
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + d.amount, 0)

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-seaweed-600 mx-auto mb-4"></div>
          <p className="text-seaweed-600">Loading donations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-seaweed-800 mb-2">Donation Management</h1>
        <p className="text-base text-seaweed-600">View and manage all donations, track contributions, and process payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-seaweed-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Donations</h3>
          <p className="text-2xl font-bold text-seaweed-600">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Completed</h3>
          <p className="text-2xl font-bold text-yellow-600">${completedAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-gray-400">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Pending</h3>
          <p className="text-2xl font-bold text-gray-600">${pendingAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
            >
              <option value="all">All Types</option>
              <option value="charity">Charity</option>
              <option value="event">Event</option>
              <option value="spiritual">Spiritual</option>
              <option value="community">Community</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-seaweed-200 bg-seaweed-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-seaweed-800">All Donations ({donations.length})</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="px-4 py-2 bg-seaweed-600 text-white rounded-lg hover:bg-seaweed-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting...' : '📥 Export CSV'}
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting...' : '📥 Export JSON'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{donation.user.name || donation.user.email}</div>
                    <div className="text-sm text-gray-500">{donation.user.email}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openStatusModal(donation)}
                      className="text-seaweed-600 hover:text-seaweed-900"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {donations.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No donations found
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        title="Update Donation Status"
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedDonation(null)
        }}
        size="sm"
      >
        {selectedDonation && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Donor:</strong> {selectedDonation.user.name || selectedDonation.user.email}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Amount:</strong> ${selectedDonation.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Current Status:</strong> {selectedDonation.status}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seaweed-500 focus:border-seaweed-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsStatusModalOpen(false)
                  setSelectedDonation(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === selectedDonation.status}
                className="px-4 py-2 bg-seaweed-600 text-white rounded-lg hover:bg-seaweed-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

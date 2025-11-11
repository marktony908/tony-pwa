'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/app/components/Modal'
import ConfirmDialog from '@/app/components/ConfirmDialog'

interface News {
  id: string
  title: string
  content: string
  excerpt?: string | null
  category: string
  imageUrl?: string | null
  isPublished: boolean
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminNews() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentNews, setCurrentNews] = useState<News | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; newsId: string | null }>({
    isOpen: false,
    newsId: null,
  })
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'announcement' as 'charity' | 'spiritual' | 'community' | 'educational' | 'announcement',
    imageUrl: '',
    isPublished: false,
  })

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/admin/news')
      const data = await response.json()
      if (data.success) {
        setNews(data.news)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'announcement',
      imageUrl: '',
      isPublished: false,
    })
    setCurrentNews(null)
    setIsCreateModalOpen(true)
  }

  const handleEdit = (newsItem: News) => {
    setCurrentNews(newsItem)
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt || '',
      category: newsItem.category as any,
      imageUrl: newsItem.imageUrl || '',
      isPublished: newsItem.isPublished,
    })
    setIsEditModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = currentNews
        ? `/api/admin/news/${currentNews.id}`
        : '/api/admin/news'
      const method = currentNews ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(currentNews ? 'News updated successfully' : 'News created successfully')
        fetchNews()
        setIsCreateModalOpen(false)
        setIsEditModalOpen(false)
      } else {
        toast.error(data.error || 'Failed to save news')
      }
    } catch (error) {
      toast.error('Error saving news')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm.newsId) return
    setSubmitting(true)

    try {
      const response = await fetch(`/api/admin/news/${deleteConfirm.newsId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        toast.success('News deleted successfully')
        fetchNews()
        setDeleteConfirm({ isOpen: false, newsId: null })
      } else {
        toast.error(data.error || 'Failed to delete news')
      }
    } catch (error) {
      toast.error('Error deleting news')
    } finally {
      setSubmitting(false)
    }
  }

  const togglePublish = async (newsItem: News) => {
    try {
      const response = await fetch(`/api/admin/news/${newsItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !newsItem.isPublished }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success(newsItem.isPublished ? 'News unpublished' : 'News published')
        fetchNews()
      } else {
        toast.error(data.error || 'Failed to update news')
      }
    } catch (error) {
      toast.error('Error updating news')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-seaweed-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-seaweed-800">News Management</h1>
        <button
          onClick={handleCreate}
          className="bg-seaweed-600 text-white px-4 py-2 rounded-lg hover:bg-seaweed-700 transition-colors font-medium"
        >
          + Create News
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-seaweed-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-seaweed-800 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-seaweed-800 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-seaweed-800 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-seaweed-800 uppercase tracking-wider">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-seaweed-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No news articles yet. Create your first one!
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    {item.excerpt && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{item.excerpt}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-seaweed-100 text-seaweed-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.isPublished ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString()
                      : 'Not published'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => togglePublish(item)}
                      className={`${
                        item.isPublished
                          ? 'text-yellow-600 hover:text-yellow-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {item.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-seaweed-600 hover:text-seaweed-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, newsId: item.id })}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        title={currentNews ? 'Edit News' : 'Create News'}
        onClose={() => {
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
        }}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-seaweed-500 focus:border-seaweed-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-seaweed-500 focus:border-seaweed-500"
              placeholder="Brief summary (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-seaweed-500 focus:border-seaweed-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-seaweed-500 focus:border-seaweed-500"
            >
              <option value="announcement">Announcement</option>
              <option value="charity">Charity</option>
              <option value="spiritual">Spiritual</option>
              <option value="community">Community</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-seaweed-500 focus:border-seaweed-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 text-seaweed-600 focus:ring-seaweed-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
              Publish immediately
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false)
                setIsEditModalOpen(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-seaweed-600 text-white rounded-md hover:bg-seaweed-700 transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? 'Saving...' : currentNews ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete News"
        message="Are you sure you want to delete this news article? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, newsId: null })}
        variant="danger"
      />
    </div>
  )
}



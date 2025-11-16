"use client"

import { useEffect, useState } from 'react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [visible, setVisible] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
      console.log('beforeinstallprompt captured')
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)
    // In dev (localhost) show the install UI automatically so it's easy to test
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (isLocal) {
        // small delay to avoid clashing with initial load
        setTimeout(() => setVisible(true), 800)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice
        console.log('userChoice', choiceResult)
        // hide the UI regardless of outcome
        setVisible(false)
        setDeferredPrompt(null)
        return
      } catch (err) {
        console.warn('Install prompt failed', err)
      }
    }

    // Fallback: show QR/manual instructions if native prompt not available
    setShowFallback(true)
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = origin
  const qrSrc = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(shareUrl)}`

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="font-semibold text-seaweed-800">Install Noor</div>
            <div className="text-xs text-gray-600">Install this app for quick access on your device.</div>
            <div className="mt-3 flex gap-2">
              <button onClick={handleInstall} className="flex-1 px-3 py-2 bg-seaweed-700 text-white rounded-md">Install</button>
              <button onClick={() => setShowQR(!showQR)} className="px-3 py-2 border border-gray-200 rounded-md">Phone</button>
            </div>
          </div>
        </div>

        {showQR && (
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-600 mb-2">Open on your phone</div>
            <img src={qrSrc} alt="QR code to open app" className="mx-auto rounded" />
            <div className="mt-2 text-xs text-gray-600 break-words">{shareUrl}</div>
            <div className="mt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl)
                }}
                className="mt-2 px-3 py-1 bg-seaweed-50 text-seaweed-700 rounded-md text-sm"
              >
                Copy link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

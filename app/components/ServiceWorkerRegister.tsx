"use client"

import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('Service worker registered.', reg)
            try {
              toast.success('Service worker registered — PWA install enabled')
            } catch (e) {
              // ignore if Toaster not mounted yet
            }
          })
          .catch((err) => {
            console.warn('Service worker registration failed:', err)
            try {
              toast.error('Service worker registration failed')
            } catch (e) {}
          })
      })
    }

    // optional: listen for beforeinstallprompt to control install prompt
    const onBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // We could save the event and show a custom install UI later
      console.log('beforeinstallprompt fired')
      // window.deferredPrompt = e
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    }
  }, [])

  return null
}

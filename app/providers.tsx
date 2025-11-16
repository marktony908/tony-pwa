"use client"

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import ServiceWorkerRegister from './components/ServiceWorkerRegister'
import PWAInstallPrompt from './components/PWAInstallPrompt'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a5d4e',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#facc15',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
      <ServiceWorkerRegister />
      <PWAInstallPrompt />
    </SessionProvider>
  )
}






import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Noor Ul Fityan',
  description: 'Web application with user frontend and admin backend',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/noor1.jpeg" />
        <link rel="apple-touch-icon" href="/images/noor2.jpeg" />
        <meta name="theme-color" content="#1a5d4e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}


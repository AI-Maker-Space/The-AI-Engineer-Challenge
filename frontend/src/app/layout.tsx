import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenAI Chat UI',
  description: 'Streamed chat UI for FastAPI OpenAI backend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">{children}</body>
    </html>
  )
}


import type { ReactNode } from 'react'

export const metadata = {
  title: 'AI Engineer Chat',
  description: 'Chat UI that streams from FastAPI backend',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



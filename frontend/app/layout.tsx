import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Mental Coach',
  description: 'A supportive mental coach for knowledge workers and founders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


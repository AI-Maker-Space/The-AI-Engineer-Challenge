import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personalized Mental Health Chat',
  description: 'Speak with your personalized mental health coach',
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



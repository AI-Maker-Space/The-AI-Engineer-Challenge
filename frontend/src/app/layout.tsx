'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="w-full flex flex-col items-center justify-center px-4 py-6 bg-gray-600" style={{ minHeight: "120px" }}>
          <div className="flex flex-row items-center gap-3">
            <Image src="/chatty-cat.svg" alt="ChattyCat logo" width={140} height={140} priority />
            <span className="text-5xl font-extrabold tracking-tight select-none text-white" aria-label="ChattyCat">ChattyCat</span>
          </div>
        </header>
        <main>
          <div className="w-full flex flex-col items-center justify-center">
          {children}
          </div>
        </main>
      </body>
    </html>
  );
}

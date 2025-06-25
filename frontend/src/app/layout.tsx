'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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
  const [theme, setTheme] = useState<'light' | 'dark'>("light");

  useEffect(() => {
    // On mount, set theme from localStorage or system
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    if (stored === "dark" || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="w-full flex flex-col items-center justify-center px-4 py-8 border-b border-gray-200 dark:border-gray-700 bg-isabelline dark:bg-wenge">
          <div className="flex flex-col items-center gap-3">
            <Image src="/chatty-cat.svg" alt="ChattyCat logo" width={150} height={150} priority />
            <span className="text-5xl font-extrabold tracking-tight select-none" aria-label="ChattyCat">ChattyCat</span>
          </div>
          <button
            aria-label="Toggle light and dark theme"
            className="absolute right-6 top-6 rounded p-2 bg-mint hover:bg-mint/80 dark:bg-mint dark:hover:bg-mint/60 focus:outline-none focus-visible:ring"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              // Sun icon
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34l-1.41-1.41m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              // Moon icon
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </header>
        <main className="max-w-2xl mx-auto w-full px-2 sm:px-0 py-6 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  );
}

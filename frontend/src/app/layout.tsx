import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const matrixMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-matrix",
});

export const metadata: Metadata = {
  title: "NEURAL_COACH // Matrix Terminal",
  description:
    "A Matrix-styled terminal frontend for the supportive mental coach chat API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={matrixMono.variable}>
      <body>{children}</body>
    </html>
  );
}

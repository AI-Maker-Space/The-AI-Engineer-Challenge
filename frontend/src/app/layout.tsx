import type { Metadata } from "next";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/700.css";
import "@fontsource/noto-serif-jp/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Ghibli Chat Assistant",
  description: "A Studio Ghibli-inspired AI chat app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-quicksand bg-ghibli-parchment min-h-screen antialiased"
        style={{
          background:
            "repeating-linear-gradient(135deg, #f7f3e8 0px, #f7f3e8 40px, #f3ecd7 40px, #f3ecd7 80px)",
          fontFamily:
            'Quicksand, "Noto Serif JP", Garamond, serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}

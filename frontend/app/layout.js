import "./globals.css";

export const metadata = {
  title: "Bouncing Balls Screensaver",
  description: "A relaxing screensaver-style app with bouncing balls."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

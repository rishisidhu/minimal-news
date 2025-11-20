import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';
import AmbientPlayer from '@/components/AmbientPlayer';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Niminal",
  description: "News without the noise. Crypto and AI news, simplified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased font-sans" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <AmbientPlayer />
        <Analytics />
      </body>
    </html>
  );
}

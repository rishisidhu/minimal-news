import type { Metadata } from "next";
import { Source_Sans_3, Merriweather } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans' });
const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather'
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
    <html lang="en" className={`${sourceSans.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

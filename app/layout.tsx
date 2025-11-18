import type { Metadata } from "next";
import { Source_Sans_3, Merriweather } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import "./globals.css";

const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans' });
const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather'
});

export const metadata: Metadata = {
  title: "Minimal News",
  description: "Crypto news, simplified. Read. Inform. Move on.",
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
      </body>
    </html>
  );
}

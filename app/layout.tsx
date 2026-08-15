import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Kartik Clarity™ — Founder Revenue Intelligence',
    template: '%s | Kartik Clarity™',
  },
  description: 'Founder Revenue Intelligence for identifying and recovering hidden revenue friction in scaling B2B SaaS organizations.',
  applicationName: 'Kartik Clarity™',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Kartik Clarity™ — Founder Revenue Intelligence',
    description: 'Diagnose hidden revenue friction and identify recoverable revenue opportunities.',
    siteName: 'Kartik Clarity™',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

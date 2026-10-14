import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import siteConfig from '../../site.config';

export const metadata: Metadata = {
  title: {
    default: 'Ammar Pack | Cardboard Box Manufacturer in Egypt',
    template: '%s | Ammar Pack',
  },
  description: 'Ammar Pack is a cardboard and corrugated packaging manufacturer in Banha, Egypt. Discuss custom cartons, printed boxes, and packaging for your business.',
  keywords: ['Ammar Pack', 'corrugated box manufacturer in Egypt', 'cardboard packaging manufacturer', 'custom cardboard boxes', 'corrugated shipping boxes', 'custom printed packaging'],
  metadataBase: new URL(siteConfig.domain),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Ammar Pack | Cardboard Box Manufacturer in Egypt',
    description: 'Cardboard cartons and packaging made in Banha, Egypt. Explore Ammar Pack and request a quotation.',
    url: siteConfig.domain,
    siteName: 'Ammar Pack',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ammar Pack cardboard packaging' }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ammar Pack | Cardboard Box Manufacturer in Egypt',
    description: 'Cardboard cartons and packaging made in Banha, Egypt.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.companyName,
  url: siteConfig.domain,
  logo: `${siteConfig.domain}/logo.png`,
  description: 'Cardboard and carton manufacturer in Banha, Egypt.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Banha',
    addressRegion: 'Qalyubia',
    addressCountry: 'EG',
  },
  email: siteConfig.email,
  telephone: siteConfig.phone,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Optional analytics measurement ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

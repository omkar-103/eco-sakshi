import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Eco Sakshi - India\'s Environmental Witness Network',
    template: '%s | Eco Sakshi',
  },
  description:
    'India\'s citizen-driven environmental compliance network. Witness, document, and trigger action against environmental violations.',
  keywords: [
    'environmental compliance',
    'pollution reporting',
    'citizen reporting',
    'environmental protection',
    'eco sakshi',
    'india environment',
  ],
  authors: [{ name: 'Omkar Parelkar' }],
  creator: 'Omkar Parelkar',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Eco Sakshi',
    title: 'Eco Sakshi - India\'s Environmental Witness Network',
    description: 'Witness, document, and trigger action against environmental violations across India.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eco Sakshi',
    description: 'India\'s citizen-driven environmental compliance network',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#166534',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-sage-50 font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #ffffff 0%, #f8faf8 100%)',
                color: '#363f30',
                borderRadius: '16px',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
                padding: '16px 20px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#16a34a', secondary: '#ffffff' },
              },
              error: {
                iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
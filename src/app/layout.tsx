import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:4000'),
  title: {
    default: 'Luraschi Bikes - Bicicletas y Accesorios',
    template: '%s | Luraschi Bikes',
  },
  description: 'Tienda especializada en bicicletas de montaña, ruta, urbanas y accesorios. Encuentra las mejores marcas y modelos para tu estilo de ciclismo.',
  keywords: ['bicicletas', 'mountain bike', 'bicicletas de ruta', 'ciclismo', 'accesorios para bicicletas', 'luraschi bikes'],
  authors: [{ name: 'Luraschi Bikes' }],
  creator: 'Luraschi Bikes',
  publisher: 'Luraschi Bikes',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'Luraschi Bikes',
    title: 'Luraschi Bikes - Bicicletas y Accesorios',
    description: 'Tienda especializada en bicicletas de montaña, ruta, urbanas y accesorios.',
    images: [
      {
        url: '/assets/logo-black.webp',
        width: 1200,
        height: 630,
        alt: 'Luraschi Bikes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luraschi Bikes - Bicicletas y Accesorios',
    description: 'Tienda especializada en bicicletas de montaña, ruta, urbanas y accesorios.',
    images: ['/assets/logo-black.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#1e3a8a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

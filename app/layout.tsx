import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Foto Upload',
  description: 'Uma galeria de fotos no S3 da AWS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} bg-blue-50 min-h-screen flex flex-col`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}

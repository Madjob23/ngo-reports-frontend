import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NGO Impact Reporting System',
  description: 'A system for NGOs to report and track impact metrics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
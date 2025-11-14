import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/provider';
import { UserProvider } from '@/lib/user/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Auth App',
  description: 'Authentication system with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

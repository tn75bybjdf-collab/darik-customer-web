import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Darik Marketplace',
  description: 'Anything you need from local retailers, delivered by Darik.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

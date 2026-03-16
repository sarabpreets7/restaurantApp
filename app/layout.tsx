import './globals.css';
import React from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

export const metadata = {
  title: 'Realtime Restaurant',
  description: 'Order and track meals in real-time'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <ThemeToggle />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

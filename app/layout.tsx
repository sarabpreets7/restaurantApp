import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Realtime Restaurant',
  description: 'Order and track meals in real-time'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">{children}</div>
      </body>
    </html>
  );
}

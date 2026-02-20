'use client';

import React from 'react';
import { Suspense } from 'react';
import '@/styles/global.css';
import Providers from '@/context/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <div>Loading...</div>
            </div>
          }
        >
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}

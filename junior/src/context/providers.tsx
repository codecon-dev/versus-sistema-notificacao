'use client';

import React from 'react';
import { Toaster } from '@/components/ui/sonner';

interface IProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<IProvidersProps> = ({ children }) => {
  return (
    <>
      <>{children}</>
      <Toaster />
    </>
  );
};

export default Providers;

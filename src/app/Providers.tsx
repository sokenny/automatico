'use client';

import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
// import { CookiesProvider } from 'next-client-cookies/server';
import { Toaster } from 'sonner';

export function Providers({ children }) {
  return (
      <SessionProvider>
        <Toaster richColors position="bottom-left" />
        <NextUIProvider>{children}</NextUIProvider>
      </SessionProvider>
  );
}

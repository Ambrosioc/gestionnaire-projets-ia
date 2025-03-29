// app/layout.tsx
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Project Manager',
  description: 'Manage your freelance projects with AI assistance',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale || 'fr'; // Définissez une locale par défaut
  const messages = (await import(`../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async />
        <Script id="onesignal-init">
          {`
            window.OneSignal = window.OneSignal || [];
            OneSignal.push(function() {
              OneSignal.init({
                appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}",
              });
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers locale={locale} messages={messages}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

import { Vazirmatn } from 'next/font/google';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import './globals.css';
import Providers from '@/lib/providers/tanstack-query';

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: '--vazir',
  weight: ['100', '200', '300', '400', '500', '600','700', '800', '900']
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={`dark:bg-gray-900`}>
        <Providers>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider></Providers>
      </body>
    </html>
  );
}

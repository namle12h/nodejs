import '@ant-design/v5-patch-for-react-19'; 

import { Inter } from 'next/font/google';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'Home - Bella Spa',
  description: 'Tiệm Spa của Nam lê',
};

export const generateViewport = () => ({
  width: 'device-width',
  initialScale: 1,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>

       <AntdRegistry>{children}</AntdRegistry>

      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import RootLayoutClient from '@/src/components/RootLayoutClient';

const ownglyph = localFont({
  src: '../../public/fonts/OwnglyphPDH.ttf',
  variable: '--font-ownglyph',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hishmas.site'),
  title: 'HISHmas',
  description: '크리스마스 트리를 꾸미고 편지를 남겨요 🎄',
  openGraph: {
    title: 'HISHmas',
    description: '크리스마스 트리를 꾸미고 편지를 남겨요 🎄',
    url: 'https://www.hishmas.site',
    siteName: 'HISHmas',
    images: [
      {
        // ✅ 절대 URL + ✅ 버전 파라미터로 카톡 캐시 뚫기
        url: 'https://www.hishmas.site/og.png?v=2',
        width: 1200,
        height: 630,
        alt: 'HISHmas 미리보기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HISHmas',
    description: '크리스마스 트리를 꾸미고 편지를 남겨요 🎄',
    images: ['https://www.hishmas.site/og.png?v=2'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={ownglyph.variable}>
      <body className="bg-grayscale-5">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}

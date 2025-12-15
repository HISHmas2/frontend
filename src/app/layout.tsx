'use client';

import { usePathname } from 'next/navigation';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import LayoutWrapper from '@/src/components/LayoutWrapper';
import Header from '@/src/components/common/Header';
import { Toaster } from 'react-hot-toast';

const ownglyph = localFont({
  src: '../../public/fonts/OwnglyphPDH.ttf',
  variable: '--font-ownglyph',
});

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTree = pathname.startsWith('/tree');

  return (
    <html lang="ko" className={ownglyph.variable}>
      <head>
        {/*  Google Tag Manager (head) */}
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
        {/*  End GTM */}
      </head>

      <body className="bg-grayscale-5">
        {/*  Google Tag Manager (noscript) : body 바로 아래 */}
        {GTM_ID && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>
        )}
        {/*  End GTM (noscript) */}

        {isTree ? (
          <>{children}</>
        ) : (
          <LayoutWrapper>
            <Header />
            <div className="pt-[56px] flex-1">{children}</div>
          </LayoutWrapper>
        )}

        <Toaster
          position="top-center"
          containerClassName="top-[calc(16px+env(safe-area-inset-top))]"
          toastOptions={{
            duration: 2000,
            style: {
              fontFamily: 'var(--font-ownglyph)',
              borderRadius: '10px',
            },
          }}
        />
      </body>
    </html>
  );
}

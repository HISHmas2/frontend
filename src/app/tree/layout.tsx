'use client';

import Header from '@/src/components/common/Header';
import MailboxButton from '@/src/app/tree/components/buttons/MailboxButton';
import Image from 'next/image';

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center bg-white">
      {/* ✅ h-screen 제거 → min-h-[100svh] */}
      <div className="relative w-full max-w-[414px] min-h-[100svh] bg-white">
        <Header />

        {/* 트리 배경 영역 */}
        <div
          className="
            relative
            w-full
            min-h-[calc(100svh-56px)]
            mt-[56px]
          "
        >
          {/* ✅ overflow-hidden은 이미지 영역에만 */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/Tree_v02.png"
              alt="tree background"
              fill
              priority
              sizes="(max-width: 414px) 100vw, 414px"
              className="
                object-contain
                object-bottom
                pointer-events-none
                select-none
              "
            />
          </div>

          {/* 페이지 콘텐츠 */}
          <div className="relative z-10 w-full h-full">{children}</div>
        </div>

        {/* 📮 Mailbox 버튼 */}
        <div
          className="
            fixed
            top-[env(safe-area-inset-top)]
            right-[calc((100%-414px)/2)]
            pr-2
            z-[9999]
            pointer-events-auto
          "
        >
          <MailboxButton />
        </div>
      </div>
    </div>
  );
}

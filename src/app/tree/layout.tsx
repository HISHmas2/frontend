// src/app/tree/layout.tsx
import Header from '@/src/components/common/Header';
import MailboxButton from '@/src/app/tree/components/buttons/MailboxButton';
import Image from 'next/image';

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex justify-center bg-white">
      <div className="relative w-full max-w-[414px] min-h-screen bg-white">
        {/* Header */}
        <Header />

        {/* 트리 배경 */}
        <div className="relative w-full min-h-[calc(100svh-56px)] mt-[56px]">
          <Image src="/images/Tree_v02.png" alt="tree background" fill priority className="object-cover object-bottom pointer-events-none select-none" />

          {/* 페이지 내용 */}
          <div className="relative w-full min-h-full z-10">{children}</div>
        </div>

        {/* 우측 상단 편지함 */}
        <div className="fixed top-[calc(8px+env(safe-area-inset-top))] right-2 z-[9999]">
          <MailboxButton />
        </div>
      </div>
    </div>
  );
}

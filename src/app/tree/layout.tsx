'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import Header from '@/src/components/common/Header';
import MailboxButton from '@/src/app/tree/components/buttons/MailboxButton';
import { CANVAS_BASE, HEADER_HEIGHT } from '@/src/app/tree/constants/canvas';

function getViewport() {
  // iOS 주소창/하단바 변동 대응: visualViewport 우선
  const vv = window.visualViewport;
  return {
    w: vv?.width ?? window.innerWidth,
    h: vv?.height ?? window.innerHeight,
  };
}

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  const [vp, setVp] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => setVp(getViewport());
    update();

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    // iOS: 주소창 열리고 닫힐 때 visualViewport가 변함
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);

  const isMobile = useMemo(() => (vp.w ? vp.w < 520 : true), [vp.w]);

  const scale = useMemo(() => {
    if (!vp.w || !vp.h) return 1;
    return Math.min(vp.w / CANVAS_BASE.width, vp.h / CANVAS_BASE.height);
  }, [vp.w, vp.h]);

  return (
    <div className="w-screen h-[100dvh] flex items-center justify-center bg-white">
      <div
        className="relative bg-white"
        style={{
          width: CANVAS_BASE.width,
          height: CANVAS_BASE.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          // ✅ 모바일에서는 잘림 방지
          borderRadius: isMobile ? 0 : 24,
          overflow: isMobile ? 'visible' : 'hidden',
        }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20" style={{ height: HEADER_HEIGHT }}>
          <Header />
        </div>

        {/* 배경 */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/Tree_v02.png" alt="tree background" fill priority className="object-cover object-bottom pointer-events-none select-none" />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="absolute left-0 right-0 z-10" style={{ top: HEADER_HEIGHT, bottom: 0 }}>
          {children}
        </div>

        {/* MailboxButton */}
        <div className="absolute z-[9999]" style={{ top: 8, right: 8 }}>
          <MailboxButton />
        </div>
      </div>
    </div>
  );
}

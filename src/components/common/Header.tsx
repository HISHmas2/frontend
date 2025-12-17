'use client';

import { useRouter } from 'next/navigation';
import { HiOutlineHome } from 'react-icons/hi2';

export default function Header() {
  const router = useRouter();

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        bg-white
        border-b
        flex justify-center
        [padding-top:env(safe-area-inset-top)]
      "
      style={{ height: 'calc(56px + env(safe-area-inset-top))' }}
    >
      <div className="relative w-full max-w-[414px] h-[56px] flex items-center justify-center px-5">
        {/* ✅ 홈 아이콘 */}
        <button
          type="button"
          onClick={() => router.push('/auth/login')}
          className="absolute left-5 flex items-center justify-center text-[#1d1d1d]"
          aria-label="로그인 페이지로 이동"
        >
          <HiOutlineHome size={24} />
        </button>

        {/* 타이틀 */}
        <h1 className="text-[24px] text-[#1d1d1d] font-['Ownglyph PDH']">HISHmas</h1>
      </div>
    </header>
  );
}

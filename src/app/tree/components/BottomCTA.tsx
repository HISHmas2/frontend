'use client';

interface BottomCTAProps {
  onClose: () => void;
}

export default function BottomCTA({ onClose }: BottomCTAProps) {
  return (
    <div
      className="
        fixed bottom-[env(safe-area-inset-bottom)]
        left-0 right-0
        z-[999]
        flex justify-center
        animate-slide-up
      "
    >
      <div
        className="
          relative
          w-full max-w-[414px]
          bg-white
          rounded-2xl
          shadow-xl
          border border-gray-200
          px-6 py-8
          mx-auto
        "
      >
        {/* 닫기 버튼 (오른쪽 상단) */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute top-3 right-3
            text-gray-400 hover:text-gray-600
            text-lg
          "
        >
          ✕
        </button>

        {/* 텍스트 */}
        <div className="flex flex-col gap-1 pr-5">
          <p className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'var(--font-ownglyph)' }}>
            ✉️ 상단 오른쪽에 편지함을 눌러
          </p>
          <p className="text-lg text-gray-700 mt-1" style={{ fontFamily: 'var(--font-ownglyph)' }}>
            따뜻한 편지를 남겨보세요
          </p>
        </div>
      </div>
    </div>
  );
}

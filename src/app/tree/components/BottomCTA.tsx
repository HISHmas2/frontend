'use client';

interface BottomCTAProps {
  onClose: () => void;
}

export default function BottomCTA({ onClose }: BottomCTAProps) {
  return (
    <div
      className="
    fixed bottom-0 left-0 right-0
    pb-[env(safe-area-inset-bottom)]
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
    rounded-t-2xl
    shadow-xl
    border border-gray-200
    px-6 pt-10 pb-12
    mx-auto
  "
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute top-4 right-4
            text-gray-400 hover:text-gray-600
            text-2xl
          "
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 텍스트 */}
        <div className="flex flex-col gap-2 pr-6">
          <p className="text-xl font-semibold text-gray-900 leading-snug" style={{ fontFamily: 'var(--font-ownglyph)' }}>
            📫 상단 오른쪽에 편지함을 눌러
          </p>

          <p className="text-lg text-gray-700 leading-snug" style={{ fontFamily: 'var(--font-ownglyph)' }}>
            따뜻한 편지를 남겨보세요!!
          </p>
        </div>
      </div>
    </div>
  );
}

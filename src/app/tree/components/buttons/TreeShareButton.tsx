'use client';

import React from 'react';
import { toast } from 'react-hot-toast';

interface TreeShareButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;

  /**  page에서 만든 공유 URL(utm 포함)을 그대로 복사 */
  shareUrl: string;

  /**  나중에 공유 기록/GA 이벤트를 붙이고 싶으면 여기에서 */
  onShared?: (url: string) => void;
}

export default function TreeShareButton({ children, disabled, shareUrl, onShared }: TreeShareButtonProps) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('링크가 복사되었어요!');
      onShared?.(shareUrl);
    } catch (err) {
      console.error(err);
      toast.error('링크 복사에 실패했어요 ');
    }
  };

  return (
    <div
      className="
        sticky bottom-0 left-0 right-0
        pb-[env(safe-area-inset-bottom)]
        bg-transparent flex justify-center z-30
      "
    >
      <button
        type="button"
        onClick={handleShare}
        disabled={disabled}
        className="
          w-[calc(100%-32px)] max-w-[382px] h-12
          bg-green-600 text-white rounded-xl
          flex items-center justify-center
          hover:opacity-90 active:opacity-80
          transition font-semibold
          text-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-md
        "
        style={{ fontFamily: 'var(--font-ownglyph)' }}
      >
        {children || '트리 공유하기'}
      </button>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import TreeShareButton from '@/src/app/tree/components/buttons/TreeShareButton';
import DecorationBottomSheet from '@/src/app/tree/components/sheets/DecorationBottomSheet';
import TreeDecorateButton from '@/src/app/tree/components/buttons/TreeDecorateButton';
import BottomCTA from '@/src/app/tree/components/BottomCTA';

import { useAuthStore } from '@/src/stores/useAuthStore';
import { useTreeDecorations } from '@/src/app/tree/hooks/useTreeDecorations';
import DecoItem from '@/src/app/tree/components/DecoItem';

export default function TreeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const { user, isLoaded, loadUser } = useAuthStore();
  const isMyTree = !!user && user.loginId === slug;

  const [hasDecorated, setHasDecorated] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (!isLoaded) loadUser();
  }, [isLoaded, loadUser]);

  // CTA 5초 자동 닫힘
  useEffect(() => {
    if (!showCTA) return;
    const t = setTimeout(() => setShowCTA(false), 5000);
    return () => clearTimeout(t);
  }, [showCTA]);

  const {
    treeRef,
    treeTitle,
    decorations,
    unsavedDecorations,
    pendingDeco,
    isTreeLoading,
    showDecoSheet,
    setShowDecoSheet,
    pickDecoration,
    placeDecoration,
    saveDecorations,
    cancelUnsavedDecorations,
  } = useTreeDecorations(slug, isMyTree);

  const hasUnsaved = unsavedDecorations.length > 0;

  const handleSaveClick = async () => {
    const ok = await saveDecorations();
    if (ok) {
      setHasDecorated(true);
      toast.success('🎄 장식이 저장되었어요!');
      setTimeout(() => setShowCTA(true), 700);
    } else {
      toast.error('저장에 실패했어요 😢');
    }
  };

  /**
   * 공유 URL (utm 포함)
   * - window.location.href 사용 ❌
   * - 의도한 트리 주소만 복사
   */
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/tree/${slug}` + `?utm_source=share&utm_medium=copy&utm_campaign=tree`;
  }, [slug]);

  return (
    <div
      className="
        min-h-[100svh]
        flex flex-col
        px-4 pt-4
        pb-[calc(96px+env(safe-area-inset-bottom))]
        relative
      "
    >
      {/* 🔼 상단 */}
      <div className="mb-4 text-left">
        <h2 className="text-2xl font-bold text-green-800 leading-snug min-h-[36px]" style={{ fontFamily: 'var(--font-ownglyph)' }}>
          {slug}님의 트리
        </h2>

        <p className="text-sm text-white mt-1" style={{ fontFamily: 'var(--font-ownglyph)' }}>
          장식 {decorations.length}개
        </p>
      </div>

      {/* 🌲 트리 영역 */}
      <div ref={treeRef} onClick={placeDecoration} className="relative w-full flex-1">
        {isTreeLoading && <div className="absolute inset-0 flex items-center justify-center text-base text-gray-500">트리 불러오는 중...</div>}

        {!isMyTree && pendingDeco && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-full bg-black/50 text-white text-sm" style={{ fontFamily: 'var(--font-ownglyph)' }}>
              트리에 붙일 위치를 눌러주세요!
            </div>
          </div>
        )}

        {decorations.map((d) => (
          <DecoItem key={d.id} d={d} />
        ))}
      </div>

      {/* 🔽 하단 버튼 */}
      <div className="mt-auto">
        {isMyTree ? (
          <TreeShareButton shareUrl={shareUrl} disabled={!shareUrl}>
            트리 공유하기
          </TreeShareButton>
        ) : (
          <>
            {!hasDecorated && !hasUnsaved && <TreeDecorateButton onClickAction={() => setShowDecoSheet(true)}>트리 장식하기</TreeDecorateButton>}

            {!hasDecorated && hasUnsaved && (
              <div className="sticky bottom-0 flex justify-center">
                <div className="w-[calc(100%-32px)] max-w-[382px] flex gap-3">
                  <button
                    onClick={cancelUnsavedDecorations}
                    className="flex-1 h-12 bg-gray-200 rounded-xl text-gray-600 font-semibold"
                    style={{ fontFamily: 'var(--font-ownglyph)' }}
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveClick}
                    className="flex-1 h-12 bg-green-600 text-white rounded-xl text-base font-semibold"
                    style={{ fontFamily: 'var(--font-ownglyph)' }}
                  >
                    장식 저장하기
                  </button>
                </div>
              </div>
            )}

            {hasDecorated && <TreeDecorateButton onClickAction={() => router.push('/auth/signup')}>내 트리 만들러 가기</TreeDecorateButton>}
          </>
        )}
      </div>

      {/* 🧾 Bottom Sheet */}
      {!isMyTree && <DecorationBottomSheet open={showDecoSheet} onClose={() => setShowDecoSheet(false)} onPick={(d) => pickDecoration(d)} />}

      {/* ✨ Soft CTA */}
      {!isMyTree && showCTA && <BottomCTA onClose={() => setShowCTA(false)} />}
    </div>
  );
}

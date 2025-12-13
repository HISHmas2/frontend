'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

  // CTA auto close
  useEffect(() => {
    if (!showCTA) return;

    const timer = setTimeout(() => {
      setShowCTA(false);
    }, 5000);

    return () => clearTimeout(timer);
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

      setTimeout(() => {
        if (!isMyTree) setShowCTA(true);
      }, 700);
    } else {
      toast.error('저장에 실패했어요 😢');
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col px-4 py-4 bg-transparent relative">
      {/* 상단 */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-green-800" style={{ fontFamily: 'var(--font-ownglyph)' }}>
          {treeTitle}
        </h2>
        <p className="text-base text-gray-600 mt-1" style={{ fontFamily: 'var(--font-ownglyph)' }}>
          장식 {decorations.length}개
        </p>

        {!isMyTree && pendingDeco && (
          <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'var(--font-ownglyph)' }}>
            트리에 붙일 위치를 눌러주세요!
          </p>
        )}
      </div>

      {/* 트리 영역 */}
      <div ref={treeRef} onClick={placeDecoration} className="relative w-full flex-1 min-h-0">
        {isTreeLoading && <div className="absolute inset-0 flex items-center justify-center text-base text-gray-500">트리 불러오는 중...</div>}

        {decorations.map((d) => (
          <DecoItem key={d.id} d={d} />
        ))}
      </div>

      {/* 하단 영역 */}
      <div className="mt-auto pb-2 shrink-0">
        {isMyTree ? (
          <TreeShareButton>트리 공유하기</TreeShareButton>
        ) : (
          <>
            {!hasDecorated && !hasUnsaved && <TreeDecorateButton onClickAction={() => setShowDecoSheet(true)}>트리 장식하기</TreeDecorateButton>}

            {!hasDecorated && hasUnsaved && (
              <div className="sticky bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] flex justify-center z-30">
                <div className="w-[calc(100%-32px)] max-w-[382px] flex gap-3">
                  <button
                    type="button"
                    onClick={cancelUnsavedDecorations}
                    className="flex-1 h-12 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition shadow-md"
                    style={{ fontFamily: 'var(--font-ownglyph)', fontSize: '16px' }}
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="flex-1 h-12 bg-green-600 text-white rounded-xl font-semibold hover:opacity-90 active:opacity-80 transition shadow-md"
                    style={{ fontFamily: 'var(--font-ownglyph)', fontSize: '16px' }}
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

      {/* Bottom Sheet */}
      {!isMyTree && <DecorationBottomSheet open={showDecoSheet} onClose={() => setShowDecoSheet(false)} onPick={(d) => pickDecoration(d)} />}

      {/* Soft CTA */}
      {!isMyTree && showCTA && <BottomCTA onClose={() => setShowCTA(false)} />}
    </div>
  );
}

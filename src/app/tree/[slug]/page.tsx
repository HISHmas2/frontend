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

  // CTA 자동 닫힘
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

  return (
    <div className="w-full h-full relative">
      {/* ✅ 오브젝트 기준 영역: “헤더 제외 전체(= children 영역)” */}
      <div ref={treeRef} onClick={placeDecoration} className="absolute inset-0">
        {/* 로딩 */}
        {isTreeLoading && <div className="absolute inset-0 flex items-center justify-center text-base text-gray-500">트리 불러오는 중...</div>}

        {/* 상단 텍스트 */}
        <div className="absolute top-4 left-0 right-0 z-20 text-center px-4">
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

        {/* ✅ 오브젝트 렌더 */}
        {decorations.map((d) => (
          <DecoItem key={d.id} d={d} />
        ))}

        {/* ✅ 하단 버튼 영역(고정) */}
        <div className="absolute left-0 right-0 bottom-0 z-30 ">
          {isMyTree ? (
            <TreeShareButton>트리 공유하기</TreeShareButton>
          ) : (
            <>
              {!hasDecorated && !hasUnsaved && <TreeDecorateButton onClickAction={() => setShowDecoSheet(true)}>트리 장식하기</TreeDecorateButton>}

              {!hasDecorated && hasUnsaved && (
                <div className="flex justify-center">
                  <div className="w-[calc(100%-32px)] max-w-[382px] flex gap-3 pb-2">
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

        {/* 바텀시트 */}
        {!isMyTree && <DecorationBottomSheet open={showDecoSheet} onClose={() => setShowDecoSheet(false)} onPick={(d) => pickDecoration(d)} />}

        {/* Soft CTA */}
        {!isMyTree && showCTA && <BottomCTA onClose={() => setShowCTA(false)} />}
      </div>
    </div>
  );
}

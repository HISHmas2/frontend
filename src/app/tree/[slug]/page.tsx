// src/app/tree/[slug]/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import TreeShareButton from '@/src/app/tree/components/buttons/TreeShareButton';
import DecorationBottomSheet from '@/src/app/tree/components/sheets/DecorationBottomSheet';
import TreeDecorateButton from '@/src/app/tree/components/buttons/TreeDecorateButton';

import { useAuthStore } from '@/src/stores/useAuthStore';
import { useTreeDecorations } from '@/src/app/tree/hooks/useTreeDecorations';
import DecoItem from '@/src/app/tree/components/DecoItem';

export default function TreeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const router = useRouter();
  const { user, isLoaded, loadUser } = useAuthStore();
  const isMyTree = !!user && user.loginId === slug;

  // ✅ 비회원 전용 상태: 한 번이라도 저장했는지
  const [hasDecorated, setHasDecorated] = useState(false);

  useEffect(() => {
    if (!isLoaded) loadUser();
  }, [isLoaded, loadUser]);

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
      setHasDecorated(true); //  저장 성공 후 "내 트리 만들러 가기"로 상태 변경
    }
  };

  return (
    <div className="h-full flex flex-col px-4 py-4 bg-transparent">
      {/* 상단 */}
      <div className="mb-3 text-center">
        <h2 className="text-xl font-bold text-green-800">{treeTitle}</h2>
        <p className="text-sm text-gray-600">장식 {decorations.length}개</p>
        {!isMyTree && pendingDeco && <p className="text-xs text-green-700 mt-1">트리에 붙일 위치를 눌러주세요!</p>}
      </div>

      {/* 트리 캔버스 */}
      <div ref={treeRef} onClick={placeDecoration} className="relative w-full flex-1">
        {isTreeLoading && <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">트리 불러오는 중...</div>}

        {decorations.map((d) => (
          <DecoItem key={d.id} d={d} />
        ))}
      </div>

      {/* 하단 버튼 영역 */}
      <div className="mt-auto pb-2 shrink-0">
        {isMyTree ? (
          //  내 트리일 때: 기존처럼 공유 버튼 1개
          <TreeShareButton>트리 공유하기</TreeShareButton>
        ) : (
          <>
            {/* 1) 비회원 + 아직 아무것도 안 붙임: 트리 장식하기 1개 */}
            {!hasDecorated && !hasUnsaved && <TreeDecorateButton onClickAction={() => setShowDecoSheet(true)}>트리 장식하기</TreeDecorateButton>}

            {/* 2) 비회원 + 장식 선택 후(unsaved 있음): 왼쪽 취소 / 오른쪽 장식 저장하기 */}
            {!hasDecorated && hasUnsaved && (
              <div
                className="
                  sticky bottom-0 left-0 right-0
                  pb-[env(safe-area-inset-bottom)]
                  bg-transparent
                  flex justify-center
                  z-30
                "
              >
                <div className="w-[calc(100%-32px)] max-w-[382px] flex gap-3">
                  <button
                    type="button"
                    onClick={cancelUnsavedDecorations}
                    className="
                      flex-1 h-12 bg-gray-200 text-gray-700
                      flex items-center justify-center
                      rounded-xl font-semibold
                      hover:bg-gray-300 transition shadow-md
                    "
                    style={{ fontFamily: 'var(--font-ownglyph)' }}
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="
                      flex-1 h-12 bg-green-600 text-white
                      rounded-xl flex items-center justify-center
                      hover:opacity-90 active:opacity-80
                      transition font-semibold shadow-md
                    "
                    style={{ fontFamily: 'var(--font-ownglyph)' }}
                  >
                    장식 저장하기
                  </button>
                </div>
              </div>
            )}

            {/* 3) 비회원 + 저장 완료 후: 내 트리 만들러 가기 1개 */}
            {hasDecorated && <TreeDecorateButton onClickAction={() => router.push('/auth/signup')}>내 트리 만들러 가기</TreeDecorateButton>}
          </>
        )}
      </div>

      {/* 장식 선택 바텀시트 (비회원일 때만) */}
      {!isMyTree && <DecorationBottomSheet open={showDecoSheet} onClose={() => setShowDecoSheet(false)} onPick={(d) => pickDecoration(d)} />}
    </div>
  );
}

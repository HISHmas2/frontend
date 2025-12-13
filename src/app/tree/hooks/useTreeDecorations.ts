'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { DecoType } from '@/src/app/tree/components/sheets/DecorationBottomSheet';
import { getTreeApi, saveDecorationsApi, type ApiDecoration } from '@/src/api/tree';

import { API_NAME_TO_TYPE, TYPE_TO_API_NAME, TYPE_TO_SRC } from '@/src/app/tree/constants/decorations';
import { CANVAS_BASE, HEADER_HEIGHT } from '@/src/app/tree/constants/canvas';

export interface Decoration {
  id: string;
  type: DecoType;
  src: string;
  x: number; // ✅ px
  y: number; // ✅ px
}

/**
 * ✅ 고정 캔버스(414×896) 기준 좌표
 * - treeRef는 “오브젝트가 붙는 영역”의 DOM
 * - 클릭 좌표는 treeRef의 rect 안에서 px로 계산
 * - API도 px로 저장/불러오기
 */
export function useTreeDecorations(slug: string, isMyTree: boolean) {
  const treeRef = useRef<HTMLDivElement>(null);

  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [unsavedDecorations, setUnsavedDecorations] = useState<Decoration[]>([]);
  const [pendingDeco, setPendingDeco] = useState<Omit<Decoration, 'x' | 'y'> | null>(null);

  const [isTreeLoading, setIsTreeLoading] = useState(false);
  const [showDecoSheet, setShowDecoSheet] = useState(false);

  const treeTitle = useMemo(() => `🎄 ${slug} 님의 트리`, [slug]);

  // ✅ 트리 붙이는 영역 높이(헤더 제외)
  const TREE_AREA_BASE = useMemo(() => {
    return {
      width: CANVAS_BASE.width,
      height: CANVAS_BASE.height - HEADER_HEIGHT,
    };
  }, []);

  /* =========================
     1) GET: Api(px) -> UI(px)
  ========================= */
  useEffect(() => {
    const fetchTree = async () => {
      try {
        setIsTreeLoading(true);
        const data = await getTreeApi(slug);

        const mapped: Decoration[] = (data.objects ?? []).map((d) => {
          const type = API_NAME_TO_TYPE[d.name];
          return {
            id: `server-${d.object_id}`,
            type,
            src: TYPE_TO_SRC[type],
            x: d.position_x, // ✅ 그대로 px
            y: d.position_y, // ✅ 그대로 px
          };
        });

        setDecorations(mapped);
        setUnsavedDecorations([]);
      } catch {
        setDecorations([]);
      } finally {
        setIsTreeLoading(false);
      }
    };

    if (slug) fetchTree();
  }, [slug]);

  /* =========================
     2) 장식 선택
  ========================= */
  const pickDecoration = (deco: { type: DecoType; src: string }) => {
    setPendingDeco({
      id: `temp-${Date.now()}`,
      type: deco.type,
      src: deco.src,
    });
    setShowDecoSheet(false);
  };

  /* =========================
     3) 트리에 배치 (px로 저장)
     - scale이 있어도 rect 기반으로 px 계산하면 동일 좌표가 들어감
  ========================= */
  const placeDecoration = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMyTree) return;
    if (!pendingDeco || !treeRef.current) return;

    const rect = treeRef.current.getBoundingClientRect();

    // 화면 좌표 -> treeRef 내부 좌표(px)
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    // ✅ treeRef는 “고정 캔버스 스케일된 결과”이므로
    // 실제 저장 px(414×(896-56))로 환산해줘야 함
    const x = (xPx / rect.width) * TREE_AREA_BASE.width;
    const y = (yPx / rect.height) * TREE_AREA_BASE.height;

    const newDeco: Decoration = {
      ...pendingDeco,
      id: `d-${Date.now()}`,
      x,
      y,
    };

    setDecorations((prev) => [...prev, newDeco]);
    setUnsavedDecorations((prev) => [...prev, newDeco]);
    setPendingDeco(null);
  };

  /* =========================
     4) 취소: 방금 붙인 것 롤백
  ========================= */
  const cancelUnsavedDecorations = () => {
    if (unsavedDecorations.length === 0) return;

    const unsavedIds = new Set(unsavedDecorations.map((d) => d.id));
    setDecorations((prev) => prev.filter((d) => !unsavedIds.has(d.id)));
    setUnsavedDecorations([]);
    setPendingDeco(null);
  };

  /* =========================
     5) SAVE: UI(px) -> Api(px)
      - 성공 여부 boolean 리턴
  ========================= */
  const saveDecorations = async (): Promise<boolean> => {
    if (unsavedDecorations.length === 0) return false;

    const unsavedIds = new Set(unsavedDecorations.map((d) => d.id));

    try {
      const payload: ApiDecoration[] = unsavedDecorations.map((d) => ({
        login_id: slug,
        name: TYPE_TO_API_NAME[d.type],
        position_x: d.x, // ✅ px 그대로
        position_y: d.y, // ✅ px 그대로
      }));

      await saveDecorationsApi(payload);

      setUnsavedDecorations([]);
      return true;
    } catch {
      setDecorations((prev) => prev.filter((d) => !unsavedIds.has(d.id)));
      setUnsavedDecorations([]);
      setPendingDeco(null);
      return false;
    }
  };

  return {
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
  };
}

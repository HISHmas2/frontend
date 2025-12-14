// src/api/tree.ts
import { api } from './common';
import type { ApiDecoName } from '@/src/app/tree/constants/decorations';

export interface ApiObject {
  object_id: string;
  name: ApiDecoName;
  position_x: number;
  position_y: number;
  user_id: string;
}

// ✅ 스웨거 응답에 message가 같이 오니까 포함(선택)
export interface GetObjectsResponse {
  message?: string;
  objects: ApiObject[];
}

export interface ApiDecoration {
  login_id: string;
  name: ApiDecoName;
  position_x: number;
  position_y: number;
}

export interface CreateObjectResponse {
  message: string;
  object: ApiObject;
}

/** ✅ 비회원도 보는 트리(오브젝트) 불러오기 */
export function getTreeApi(login_id: string) {
  return api<GetObjectsResponse>(`/objects/public/${login_id}`);
}

/** 오브젝트 1개 저장 (비회원 가능이면 그대로 사용) */
export function createObjectApi(body: ApiDecoration) {
  return api<CreateObjectResponse, ApiDecoration>('/objects', {
    method: 'POST',
    body,
  });
}

export async function saveDecorationsApi(payload: ApiDecoration[]) {
  await Promise.all(payload.map((obj) => createObjectApi(obj)));
}

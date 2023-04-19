import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type { MemoTitleandId } from '../types/memo'
import type { Memo } from '$prisma/client'

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window === 'undefined' ? undefined : window.sessionStorage
})

const allMemoState = atom<Memo[]>({
  key: 'allMemoState',
  default: [],
  effects_UNSTABLE: [persistAtom]
})

const currentMemoIdState = atom({
  key: 'currentMemoIdState',
  default: [],
  effects_UNSTABLE: [persistAtom]
})

const allMemoTitleandIdState = selector({
  key: 'allMemoTitleandIdState',
  get: ({ get }) => {
    const allMemo = get(allMemoState)
    const currentMemoId = get(currentMemoIdState)
    const allMemoTitleandId: MemoTitleandId[] = allMemo.map((memo) => {
      return {
        id: memo.id,
        title: memo.title,
        isCurrent: memo.id === currentMemoId
      }
    })
    return allMemoTitleandId
  }
})

export { allMemoTitleandIdState, currentMemoIdState, allMemoState }

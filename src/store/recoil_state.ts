import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type { MemoTitleandId } from '../types/memo'

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window === 'undefined' ? undefined : window.sessionStorage
})

const allMemoTitleandIdState = atom<MemoTitleandId[]>({
  key: 'allMemoTitleandIdState',
  default: [],
  effects_UNSTABLE: [persistAtom]
})

const currentMemoIdState = atom({
  key: 'currentMemoIdState',
  default: [],
  effects_UNSTABLE: [persistAtom]
})

export { allMemoTitleandIdState, currentMemoIdState }

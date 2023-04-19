import type { NextPage } from 'next'
import Layout from '~/components/Layout'
import useAspidaSWR from '@aspida/swr'
import { apiClient } from '~/utils/apiClient'
import {
  allMemoState,
  allMemoTitleandIdState,
  currentMemoIdState
} from '~/store/recoil_state'
import type { MemoTitleandId } from '~/types/memo'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useEffect } from 'react'
import type { Memo } from '$prisma/client'

const Home: NextPage = () => {
  //すべてのメモを取得する
  const { data: memos, error } = useAspidaSWR(apiClient.memos)
  const [allMemos, setAllMemos] = useRecoilState<Memo[]>(allMemoState)
  const [currentMemoId, setCurrentMemoId] =
    useRecoilState<string>(currentMemoIdState)
  const allMemoTitleandId = useRecoilValue<MemoTitleandId[]>(
    allMemoTitleandIdState
  )
  useEffect(() => {
    setCurrentMemoId('')
  }, [currentMemoId])
  useEffect(() => {
    if (memos) {
      setAllMemos(memos)
    }
  }, [memos, allMemos])

  if (error) return <div>failed to load</div>
  if (!memos) return <div>loading...</div>

  return (
    <Layout listOfMemos={allMemoTitleandId}>
      <div>ノートアプリへようこそ</div>
    </Layout>
  )
}
export default Home

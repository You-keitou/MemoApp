import type { NextPage } from 'next'
import Demo from '~/components/RichText'
import Layout from '~/components/Layout'
import { Input } from '@mantine/core'
import useAspidaSWR from '@aspida/swr'
import { apiClient } from '~/utils/apiClient'
import { allMemoTitleandIdState } from '~/store/recoil_state'
import type { MemoTitleandId } from '~/types/memo'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const { data: memos, error } = useAspidaSWR(apiClient.memos)
  const [allMemoTitleandId, setAllMemoTitleandId] = useRecoilState<
    MemoTitleandId[]
  >(allMemoTitleandIdState)
  useEffect(() => {
    if (memos) {
      setAllMemoTitleandId(
        memos.map((memo) => ({
          id: memo.id,
          title: memo.title
        })) as MemoTitleandId[]
      )
    }
  }, [memos, setAllMemoTitleandId])

  if (error) return <div>failed to load</div>
  if (!memos) return <div>loading...</div>

  return (
    <Layout listOfMemos={allMemoTitleandId}>
      <div>ノートアプリへようこそ</div>
    </Layout>
  )
}
export default Home

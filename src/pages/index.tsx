import type { NextPage } from 'next'
import Layout from '~/components/Layout'
import useAspidaSWR from '@aspida/swr'
import { apiClient } from '~/utils/apiClient'

const Home: NextPage = () => {
  //すべてのメモを取得する
  const { data: memos, error, mutate } = useAspidaSWR(apiClient.memos)
  if (error) return <div>failed to load</div>
  if (!memos) return <div>loading...</div>

  //メモのタイトルとIDを取得する
  const allMemoTitleandId = memos.map((memo) => {
    return {
      id: memo.id,
      title: memo.title,
      isCurrent: false
    }
  })
  return (
    <Layout listOfMemos={allMemoTitleandId} fetcher={mutate}>
      <div>ノートアプリへようこそ</div>
    </Layout>
  )
}
export default Home

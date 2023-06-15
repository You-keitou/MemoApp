import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import Demo from '~/components/RichText'
import type { Memo } from '$prisma/client'
import useAspidaSWR from '@aspida/swr'
import { apiClient } from '~/utils/apiClient'

const index: NextPage = () => {
  //ルーターの宣言、および現在のメモのIDを宣言する
  const router = useRouter()
  const [currentMemoId, setCurrentMemoId] = useState<string>()

  //ローターの変更を監視する、変更があれば現在のメモのIDを更新する
  useEffect(() => {
    setCurrentMemoId((router.query.id as string) || undefined)
  }, [router])
  //すべてのメモを取得する
  const {
    data: memos,
    error: memosError,
    mutate
  } = useAspidaSWR(apiClient.memos, {})

  if (memosError) return <div>failed to load</div>
  if (!memos) return <div>loading...</div>

  const allMemoTitleandId = memos.map((memo) => {
    return {
      id: memo.id,
      title: memo.title,
      isCurrent: memo.id === currentMemoId
    }
  })

  const currentMemo = memos.find((memo) => memo.id === router.query.id) as Memo
  return (
    <Layout listOfMemos={allMemoTitleandId} fetcher={mutate}>
      {router.query.id && (
        <Demo
          title={currentMemo.title}
          content={currentMemo.content}
          currentMemoId={currentMemo.id}
          eventHandler={mutate}
        />
      )}
    </Layout>
  )
}

export default index

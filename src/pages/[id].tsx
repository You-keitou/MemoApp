import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import Demo from '~/components/RichText'
import type { Memo } from '$prisma/client'
import {
  currentMemoIdState,
  allMemoTitleandIdState,
  allMemoState
} from '~/store/recoil_state'
import { useRecoilState, useRecoilValue } from 'recoil'
import type { MemoTitleandId } from '~/types/memo'

const index: NextPage = () => {
  const router = useRouter()
  const allMemoTitleandId = useRecoilValue<MemoTitleandId[]>(
    allMemoTitleandIdState
  )
  const allMemos = useRecoilValue<Memo[]>(allMemoState)
  const [currentMemoId, setCurrentMemoId] =
    useRecoilState<string>(currentMemoIdState)

  const [currentMemo, setCurrentMemo] = useState<Memo>({
    id: '',
    title: '',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  useEffect(() => {
    if (router.isReady) {
      setCurrentMemoId(router.query.id as string)
    }
  }, [router.query])
  useEffect(() => {
    const currentMemo = allMemos.find((memo) => memo.id === currentMemoId)
    if (currentMemo) {
      setCurrentMemo(currentMemo)
    }
  }, [currentMemoId])
  return (
    <Layout listOfMemos={allMemoTitleandId}>
      <Demo title={currentMemo.title} content={currentMemo.content} />
    </Layout>
  )
}

export default index

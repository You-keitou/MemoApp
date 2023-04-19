import useAspidaSWR from '@aspida/swr'
import { Input } from '@mantine/core'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import Demo from '~/components/RichText'
import { apiClient } from '~/utils/apiClient'
import type { Memo } from '$prisma/client'
import {
  currentMemoIdState,
  allMemoTitleandIdState
} from '~/store/recoil_state'
import { useRecoilState, useRecoilValue } from 'recoil'
import type { MemoTitleandId } from '~/types/memo'

const index: NextPage = () => {
  const router = useRouter()
  const allMemoTitleandId = useRecoilValue<MemoTitleandId[]>(
    allMemoTitleandIdState
  )
  const [currentMemoId, setCurrentMemoId] =
    useRecoilState<string>(currentMemoIdState)
  useEffect(() => {
    if (router.isReady) {
      setCurrentMemoId(router.query.id as string)
    }
  }, [router, router.query])
  const { data: memo, error } = useAspidaSWR(
    apiClient.memos._memoId(currentMemoId)
  )
  if (error) return <div>failed to load</div>
  if (!memo) return <div>loading...</div>
  console.log(memo.title)

  return (
    <Layout listOfMemos={allMemoTitleandId}>
      <Demo title={memo.title} content={memo.content} />
    </Layout>
  )
}

export default index

import type { NextPage } from 'next'
import Layout from '~/components/Layout'
import useAspidaSWR from '@aspida/swr'
import { apiClient } from '~/utils/apiClient'
import { ServerError } from '~/components/Error'
import CustomLoader from '~/components/Loader'
import { Box, Center, Container, Flex } from '@mantine/core'
import FeaturesCards from '~/components/FeturesCards'

const Home: NextPage = () => {
  //すべてのメモを取得する
  const { data: memos, error, mutate } = useAspidaSWR(apiClient.memos)
  if (error) return <ServerError />
  if (!memos) return <CustomLoader />

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
      <FeaturesCards />
    </Layout>
  )
}
export default Home

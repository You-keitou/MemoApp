import type { NextPage } from 'next'
import Demo from '~/components/RichText'
import Layout from '~/components/Layout'
import { Input } from '@mantine/core'

const Home: NextPage = () => {
  return (
    <Layout>
      <Input.Wrapper label={'title'}>
        <Input />
      </Input.Wrapper>
      <Demo></Demo>
    </Layout>
  )
}
export default Home

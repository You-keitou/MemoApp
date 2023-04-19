import { AppShell, Box, Header, Image, NavLink } from '@mantine/core'

import { pagesPath, staticPath } from '~/utils/$path'
import Memobar from './NavbarSearch'
import { IconBook } from '@tabler/icons-react'
import { memo } from 'react'

import type { MemoTitleandId } from '~/types/memo'
import { useRouter } from 'next/router'

//レイアウトのpropsの型を定義する
type layoutProps = {
  children: React.ReactNode
  listOfMemos: MemoTitleandId[]
}

const Layout = memo(({ children, listOfMemos }: layoutProps) => {
  const listData = listOfMemos.map((memo) => ({
    id: memo.id,
    icon: IconBook,
    label: memo.title,
    active: memo.isCurrent
  }))
  const router = useRouter()

  const listItems = listData.map((item, index) => (
    <NavLink
      key={index}
      active={item.active}
      icon={<item.icon size={'1rem'} stroke={1.5} />}
      label={item.label}
      onClick={(e) => {
        e.preventDefault()
        router.push(pagesPath._id(item.id).$url())
      }}
    />
  ))

  return (
    <AppShell
      padding="md"
      navbar={
        <Memobar>
          <Box w={'auto'} h={'auto'}>
            {listItems}
          </Box>
        </Memobar>
      }
      header={
        <Header height={70} p="xs">
          {
            // Your header here
            //Icon とタイトル
            <Image
              src={staticPath.vercel_svg}
              height={50}
              width={'auto'}
            ></Image>
          }
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0]
        }
      })}
    >
      {/* Your application here */}
      {children}
    </AppShell>
  )
})

Layout.displayName = 'Layout'

export default Layout

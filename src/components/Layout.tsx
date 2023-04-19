import { AppShell, Box, Header, NavLink } from '@mantine/core'
import type { Memo } from '$prisma/client'
import { pagesPath } from '~/utils/$path'
import Memobar from './NavbarSearch'
import { IconBook } from '@tabler/icons-react'
import { memo } from 'react'
import { useRouter } from 'next/router'
import type { MemoTitleandId } from '~/types/memo'
import { useRecoilState } from 'recoil'
import { currentMemoIdState } from '~/store/recoil_state'

//レイアウトのpropsの型を定義する
type layoutProps = {
  children: React.ReactNode
  listOfMemos: MemoTitleandId[]
}

const Layout = memo(({ children, listOfMemos }: layoutProps) => {
  const [currentMemoId, setCurrentMemoId] =
    useRecoilState<string>(currentMemoIdState)
  const active = listOfMemos.findIndex((memo) => memo.id === currentMemoId)
  const router = useRouter()

  const listData = listOfMemos.map((memo) => ({
    id: memo.id,
    icon: IconBook,
    label: memo.title
  }))

  const listItems = listData.map((item, index) => (
    <NavLink
      key={index}
      active={active === index}
      icon={<item.icon size={'1rem'} stroke={1.5} />}
      label={item.label}
      onClick={(e) => {
        e.preventDefault()
        setCurrentMemoId(item.id)
        router.push(pagesPath._id(item.id).$url())
      }}
    />
  ))

  return (
    <AppShell
      padding="md"
      navbar={
        <Memobar>
          <Box w={220}>{listItems}</Box>
        </Memobar>
      }
      header={
        <Header height={60} p="xs">
          {/* Header content */}
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

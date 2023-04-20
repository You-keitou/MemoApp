import { AppShell, Box, Header, Image } from '@mantine/core'
import { staticPath } from '~/utils/$path'
import Memobar from './NavbarSearch'
import { IconBook } from '@tabler/icons-react'
import { memo } from 'react'
import type { MemoTitleandId } from '~/types/memo'
import { KeyedMutator } from 'swr'
import { Memo } from '$prisma/client'
import ListItem from './ListItem'

//レイアウトのpropsの型を定義する
//feacherはswrのKeyedMutator<Memo[]>型で、もう一度データベースからデータを取得するために使う
type layoutProps = {
  children: React.ReactNode
  listOfMemos: MemoTitleandId[]
  fetcher?: KeyedMutator<Memo[]>
}

const Layout = memo(({ children, listOfMemos, fetcher }: layoutProps) => {
  //引数でもらったlistOfMemosをmapで回して、整形する
  const listData = listOfMemos.map((memo) => ({
    id: memo.id,
    icon: IconBook,
    label: memo.title,
    active: memo.isCurrent
  }))

  return (
    <AppShell
      padding="md"
      navbar={
        <Memobar fetcher={fetcher as KeyedMutator<Memo[]>}>
          <Box w={'auto'}>
            {listData.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                fetcher={fetcher as KeyedMutator<Memo[]>}
              />
            ))}
          </Box>
        </Memobar>
      }
      header={
        <Header height={70} p="xs">
          {
            // Your header here
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

import {
  Button,
  Center,
  Container,
  Navbar,
  ScrollArea,
  createStyles
} from '@mantine/core'
import { KeyedMutator } from 'swr'
import type { Memo } from '$prisma/client'
import { IconTextPlus } from '@tabler/icons-react'
import { apiClient } from '~/utils/apiClient'
//Navbarのpropsの型を定義する
type navbarProps = {
  children: React.ReactNode
  fetcher: KeyedMutator<Memo[]>
}

const useStyles = createStyles(() => ({
  div: {
    cursor: 'pointer'
  }
}))

function Memobar({ children, fetcher }: navbarProps) {
  const { classes } = useStyles()
  return (
    <Navbar height={'auto'} p="xs" width={{ base: 300 }}>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        {children}
        <Center>
          <div className={classes.div}>
            <IconTextPlus
              size={48}
              strokeWidth={2}
              color={'#4044bf'}
              onClick={async () => {
                apiClient.memos
                  .post({
                    body: {
                      title: '新しいメモ',
                      content: ''
                    }
                  })
                  .then(() => {
                    if (fetcher) fetcher()
                  })
              }}
            />
          </div>
        </Center>
      </Navbar.Section>
    </Navbar>
  )
}

export default Memobar

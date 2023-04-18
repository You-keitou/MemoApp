import useAspidaSWR from '@aspida/swr'
import { AppShell, Navbar, Header, NavLink } from '@mantine/core'
import { apiClient } from '~/utils/apiClient'

type layoutProps = {
  children: React.ReactNode
  isHome?: boolean
}

function Layout({ children }: layoutProps) {
  const { data: memos, error, mutate } = useAspidaSWR(apiClient.memos)

  const getNavItems = (): React.ReactNode => {
    if (error) {
      return (
        <NavLink href="/login" color="red">
          Error
        </NavLink>
      )
    } else {
      //もし、memosがなかったら、navbarにloadingを表示する
      if (!memos) {
        return (
          <NavLink href="/login" color="red">
            Loading...
          </NavLink>
        )
      }
      //もし、memosがあったら、navbarにmemosを表示する
      return memos.map((memo) => (
        <NavLink href={`/memos/${memo.id}`} key={memo.id}>
          {memo.title}
        </NavLink>
      ))
    }
  }

  const navItems = getNavItems()

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height={500} p="xs">
          {navItems}
        </Navbar>
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
}

export default Layout

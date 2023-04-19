import { Navbar, ScrollArea } from '@mantine/core'

//Navbarのpropsの型を定義する
type navbarProps = {
  children: React.ReactNode
}

function Memobar({ children }: navbarProps) {
  return (
    <Navbar height={600} p="xs" width={{ base: 300 }}>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        {children}
      </Navbar.Section>
    </Navbar>
  )
}

export default Memobar

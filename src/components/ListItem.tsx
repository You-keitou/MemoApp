import { useHover } from '@mantine/hooks'
import type { Memo } from '$prisma/client'
import { KeyedMutator } from 'swr'
import { pagesPath } from '~/utils/$path'
import { IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { NavLink, createStyles } from '@mantine/core'
import { apiClient } from '~/utils/apiClient'

type listItemProps = {
  id: string
  icon: React.ComponentType<{ size: string; stroke: number }>
  label: string
  active: boolean
}
type ComponentProps = {
  item: listItemProps
  fetcher: KeyedMutator<Memo[]>
}

const listItem = ({ item, fetcher }: ComponentProps) => {
  const { hovered, ref } = useHover()
  return (
    <Link href={pagesPath._id(item.id).$url()}>
      <div ref={ref}>
        <NavLink
          active={item.active}
          icon={<item.icon size={'1rem'} stroke={1.5} />}
          label={item.label}
          rightSection={
            hovered ? (
              <IconTrash
                size={'1rem'}
                stroke={1.5}
                onClick={async () => {
                  await apiClient.memos
                    ._memoId(item.id)
                    .$delete()
                    .then(() => {
                      if (fetcher) fetcher()
                    })
                }}
              />
            ) : null
          }
          m={'xs'}
        />
      </div>
    </Link>
  )
}

export default listItem

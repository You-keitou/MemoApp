export const pagesPath = {
  _id: (id: string | number) => ({
    $url: (url?: { hash?: string }) => ({ pathname: '/[id]' as const, query: { id }, hash: url?.hash })
  }),
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath

export const staticPath = {
  favicon_png: '/favicon.png',
  vercel_svg: '/vercel.svg'
} as const

export type StaticPath = typeof staticPath

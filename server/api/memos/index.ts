import type { Memo } from '$prisma/client'

export type Methods = {
  get: {
    query?: {
      limit?: number
      message?: string
    }

    resBody: Memo[]
  }
  post: {
    reqBody: Pick<Memo, 'title' | 'content'>
    resBody: Memo
  }
}

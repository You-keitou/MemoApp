import type { Memo } from '$prisma/client'

export type Methods = {
  get: {
    resBody: Memo
    status: 200
  }
  put: {
    reqBody: Partial<Pick<Memo, 'id' | 'title' | 'content'>>
    status: 204
  }
  delete: {
    status: 204
  }
}

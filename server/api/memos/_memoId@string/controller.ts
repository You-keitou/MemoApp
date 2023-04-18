import { defineController } from './$relay'

export default defineController((fastify) => ({
  get: {
    handler: async ({ params }) => {
      const memo = await fastify.prisma.memo.findUnique({
        where: { id: params.memoId }
      })
      if (!memo) return { status: 404 }
      return { status: 200, body: memo }
    }
  },

  put: {
    handler: async ({ body, params }) => {
      await fastify.prisma.memo.update({
        where: { id: params.memoId },
        data: body
      })
      return { status: 204 }
    }
  },

  delete: {
    handler: async ({ params }) => {
      await fastify.prisma.memo.delete({ where: { id: params.memoId } })
      return { status: 204 }
    }
  }
}))

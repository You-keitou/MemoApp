import { defineController } from './$relay'

export default defineController((fastify) => ({
  get: {
    handler: async () => {
      const memos = await fastify.prisma.memo.findMany()
      return { status: 200, body: memos }
    }
  },
  post: {
    handler: async ({ body }) => {
      const memo = await fastify.prisma.memo.create({
        data: {
          title: body.title,
          content: body.content
        }
      })
      return { status: 200, body: memo }
    }
  }
}))

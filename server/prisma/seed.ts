import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const memo1 = await prisma.memo.create({
    data: {
      title: 'Hello',
      content: '今日はいい天気ですね'
    }
  })
  const memo2 = await prisma.memo.create({
    data: {
      title: '二回目のメモ',
      content: '今日はいい天気ですね。明日もいい天気ですね'
    }
  })

  const memo3 = await prisma.memo.create({
    data: {
      title: '三回目のメモ',
      content:
        '今日はいい天気ですね。明日もいい天気ですね。明後日もいい天気ですね'
    }
  })

  console.log({ memo1, memo2, memo3 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

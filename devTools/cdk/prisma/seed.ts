const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: process.env.USER_EMAIL },
    update: {},
    create: {
      name: process.env.USER_NAME,
      userId: process.env.USER_ID,
      email: process.env.USER_EMAIL,
      role: process.env.USER_ROLE,
      posts: {
        create: {
          title: 'シード生成記事',
          content: '# sample post',
          published: true,
        }
      }
    }
  })
  console.log({ admin })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
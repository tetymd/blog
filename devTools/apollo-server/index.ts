import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
const prisma = new PrismaClient()

async function main() {
  const typeDefs = `
    type User {
      id: String
      userId: String
      name: String
      email: String!
      createdAt: String
      role: String
      posts: [Post!]
    }
    type Post {
      id: String
      title: String
      content: String
      createdAt: String
      authorId: String
      updateAt: String
      published: Boolean
    }
    type Query {
      allUsers: [User!]!
      allPosts: [Post!]
    }
  `
  const resolvers = {
    Query: {
      allUsers: () => {
        return prisma.user.findMany({
          include: { posts: true },
        })
      },
      allPosts: () => {
        return prisma.post.findMany()
      },
    }
  }
  const server = new ApolloServer({ resolvers, typeDefs })
  server.listen({ port: 4000 })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
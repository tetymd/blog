import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
const { readFileSync } = require('fs')

const prisma = new PrismaClient()

async function main() {
  const typeDefs = readFileSync('./apollo-server/schema.gql').toString('utf-8')
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
      getUserById: (_: any, args: { id: number }) => {
        const id = +args.id
        return prisma.user.findUnique({
          where: { id }
        })
      }
    },
    Mutation: {
      createPost: (_: any, args: {
        title: string,
        content: string,
        authorId: number
      }) => {
        const id = +args.authorId
        return prisma.post.create({
          data: {
            title: args.title,
            content: args.content,
            authorId: id
          }
        })
      },
      updatePost: (_: any, args: {
        title: string,
        content: string,
        postId: number
      }) => {
        const id = +args.postId
        return prisma.post.update({
          where: { id: id },
          data: {
            title: args.title,
            content: args.content
          }
        })
      },
      deletePost: (_: any, args: {
        postId: number
      }) => {
        const id = +args.postId
        prisma.post.delete({ where: { id: id } })
        return `Delete post ID: ${args.postId}`
      }
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
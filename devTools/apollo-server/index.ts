import { PrismaClient } from '../cdk/node_modules/@prisma/client'
import { ApolloServer } from 'apollo-server'
import Prisma from '@prisma/client'
import { cursorTo } from 'readline'
const { readFileSync } = require('fs')

const prisma = new PrismaClient()

async function main() {
  const typeDefs = readFileSync('./cdk/graphql/schema.gql').toString('utf-8')
  const resolvers = {
    Query: {
      allUsers: () => {
        return prisma.user.findMany({
          include: { posts: true },
        })
      },
      allPosts: (_: any, args: {take: number, cursor: number}) => {
        console.log(args)
        return prisma.post.findMany({
          take: args.take,
          cursor: {
            id: args.cursor
          },
          orderBy: [{
            id: 'desc'
          }]
        })
      },
      getUserById: (_: any, args: { id: number }) => {
        const id = +args.id
        return prisma.user.findUnique({
          where: { id }
        })
      },
      getPostById: (_: any, args: { id: number }) => {
        const id = +args.id
        return prisma.post.findUnique({
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
          .then(
            data => {
              console.log(data)
            }
          )
          .catch(
            err => {
              console.log(err)
            }
          )
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
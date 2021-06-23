import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
const prisma = new PrismaClient()

async function main() {
  const typeDefs = `
    type User {
      email: String!
      name: String
    }
    type Query {
      allUsers: [User!]!
    }
  `
  const resolvers = {
    Query: {
      allUsers: () => {
        return prisma.user.findMany()
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
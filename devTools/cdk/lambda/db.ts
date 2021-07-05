import { PrismaClient } from '@prisma/client'
import { SecretsManager } from 'aws-sdk'

const sm = new SecretsManager()
let db: PrismaClient

export const getDB = async () => {
  if (db) return db

  const dbURL = await sm
    .getSecretValue({
      SecretId: process.env.SECRET_ID || '',
    })
    .promise()

  const secretString = JSON.parse(dbURL.SecretString || '{}')
  const url = `mysql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/blog`
  console.log(dbURL, secretString, url)

  db = new PrismaClient({
    datasources: { 
      db: {
        url: url
      },
    },
  })
  return db
}
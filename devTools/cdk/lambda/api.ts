import { getDB } from './db'

exports.handler = async function(event) {
  const prisma = await getDB()

  console.log("request:", JSON.stringify(event, undefined, 2));

  const allUsers = async () => {
    try {
      console.log("exec query allUsers")
      return await prisma.user.findMany({
        include: { posts: true },
      })
    } catch (err) {
      console.log("Error:", err)
      return null
    }
  }

  const allPosts = async () => {
    try {
      console.log("exec query allPosts")
      return await prisma.post.findMany()
    } catch (err) {
      console.log("Error:", err)
      return null
    }
  }

  switch (event.info.fieldName) {
    case 'allUsers':
      return await allUsers()
    case 'allPosts':
      return await allPosts()
  }

  // prisma.user.findUnique({
  //   where: { id }
  // })

  // prisma.post.findUnique({
  //   where: { id }
  // })

  // prisma.post.create({
  //   data: {
  //     title: args.title,
  //     content: args.content,
  //     authorId: id
  //   }
  // })

  // prisma.post.update({
  //   where: { id: id },
  //   data: {
  //     title: args.title,
  //     content: args.content
  //   }
  // })

  // prisma.post.delete({ where: { id: id } })
  // .then(
  //   data => {
  //     console.log(data)
  //   }
  // )
  // .catch(
  //   err => {
  //     console.log(err)
  //   }
  // )
};
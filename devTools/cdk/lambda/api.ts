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

  const allPosts = async (args: any) => {
    try {
      if (args.cursor === 0) {
        const c = await prisma.post.findMany({
          take: -1
        })
        args.cursor = c[0].id-9
        console.log(args)
      }
      console.log("exec query allPosts")
      console.log(args)
      const r = await prisma.post.findMany({
        take: args.take,
        cursor: {
          id: args.cursor
        },
        orderBy: {
          id: "desc"
        }
      })
      console.log(r)
      return r
    } catch (err) {
      console.log("Error:", err)
      return null
    }
  }

  const getUserById = async (args: any) => {
    const id = +args.id
    try {
      console.log("exec query getUserByID")
      return await prisma.user.findUnique({
        where: { id: id },
        include: { posts: true },
      })
    } catch (err) {
      console.log("Error:", err)
      return null
    }
  }

  const getPostById = async (args: any) => {
    const id = +args.id
    try {
      console.log("exec query getPostByID")
      return await prisma.post.findUnique({
        where: { id: id }
      })
    } catch (err) {
      console.log("Error:", err)
      return null
    }
  }

  const createPost = async (args: any) => {
    const id = +args.authorId
    try {
      console.log("exec mutation createPost")
      return await prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          authorId: id
        }
      })
    } catch (err) {
      console.log("Error:", err)
      return null
    }
  }

  const updatePost = async (args: any) => {
    const id = +args.postId
    try {
      console.log("exec mutation updatePost")
      return await prisma.post.update({
        where: { id: id },
        data: {
          title: args.title,
          content: args.content
        }
      })
    } catch (err) {
      console.log("Error:", err)
      return null
    }
  }

  const deletePost = async (args: any) => {
    const id = +args.postId
    try {
      console.log("exec mutation deletePost")
      return await prisma.post.delete(
        { where: { id: id } }
      )
    } catch (err) {
      console.log("Error:", err)
      return err
    }
  }

  switch (event.info.fieldName) {
    case 'allUsers':
      return await allUsers()
    case 'allPosts':
      return await allPosts(event.arguments)
    case 'getUserById':
      return await getUserById(event.arguments)
    case 'getPostById':
      return await getPostById(event.arguments)
    case 'createPost':
      return await createPost(event.arguments)
    case 'updatePost':
      return await updatePost(event.arguments)
    case 'deletePost':
      return await deletePost(event.arguments)
  }
};
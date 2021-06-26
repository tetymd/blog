import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query {
    allPosts{
      id
      title
      createdAt
    }
  }
`

// export const GET_ALL_POSTS = gql`
//   query {
//     allPosts{
//       id
//       title
//       content
//       createdAt
//       authorId
//       updateAt
//       published
//     }
//   }
// `
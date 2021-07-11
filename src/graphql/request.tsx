import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query allPosts(
    $take: Int
    $cursor: Int
  ) {
    allPosts(take: $take cursor: $cursor) {
      id
      title
      createdAt
    }
  }
`

export const GET_POST = gql`
  query getPostById($id: ID) {
    getPostById(id: $id) {
      id
      title
      content
      createdAt
      authorId
      updatedAt
      published
    }
  }
`

export const CREATE_POST = gql`
  mutation CreatePost(
    $title: String
    $content: String
    $authorId: ID
  ) {
    createPost(
      title: $title
      content: $content
      authorId: $authorId
    ) {
      id
      title
      createdAt
    }
  }
`

export const UPDATE_POST = gql`
  mutation UpdatePost(
    $title: String
    $content: String
    $postId: ID
  ) {
    updatePost(
      title: $title
      content: $content
      postId: $postId
    ) {
      id
      title
      content
    }
  }
`

export const DELETE_POST = gql`
  mutation DeletePost(
    $postId: ID
  ) {
    deletePost(
      postId: $postId
    )
  }
`
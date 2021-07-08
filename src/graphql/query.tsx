import { DocumentNode, TypedDocumentNode, gql } from '@apollo/client'

type GqlQuery = {
  name: string,
  query: DocumentNode
}

type GqlMutation = {
  name: string,
  mutation: TypedDocumentNode
}

export const GET_ALL_POSTS: GqlQuery = {
  name: "allPosts",
  query: gql`
    query {
      allPosts{
        id
        title
        createdAt
      }
    }
  `
}

export const GET_POST: GqlQuery = {
  name: 'getPostById',
  query: gql`
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
}

export const CREATE_POST: GqlMutation = {
  name: 'CreatePost',
  mutation: gql`
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
}

export const UPDATE_POST: GqlMutation = {
  name: 'UpdatePost',
  mutation: gql`
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
        title
      }
    }
  `
}

export const DELETE_POST: GqlMutation = {
  name: 'DeletePost',
  mutation: gql`
    mutation DeletePost(
      $postId: ID
    ) {
      deletePost(
        postId: $postId
      )
    }
  `
}
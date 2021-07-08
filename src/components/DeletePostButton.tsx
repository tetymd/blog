import {
  Button,
} from '@material-ui/core'
import { GET_ALL_POSTS, DELETE_POST } from '../graphql/query'
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom'

export default function DeletePostButton() {
  const params: any = useParams()
  console.log(params.id)
  const [deletePost, { data }] = useMutation(DELETE_POST.mutation, {
    update (cache) {
      var existingPosts: any = cache.readQuery({
        query: GET_ALL_POSTS.query,
      });
      const newPosts = existingPosts.allPosts.filter((p: any) => (p.id !== params.id))
      console.log(newPosts)

      if (existingPosts && newPosts) {
        console.log("update")
        cache.writeQuery({
          query: GET_ALL_POSTS.query,
          data: {
            allPosts: newPosts,
          },
        });
      }
    }
  })

  const handleSubmit = () => {
    deletePost({
      variables: { postId: params.id }
    })
  }
  
  return (
    <Button variant="contained" color="secondary" onClick={() => { handleSubmit() }}>削除</Button>
  )
}
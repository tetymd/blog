import { useState, useRef} from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import MDEditor from '@uiw/react-md-editor';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { GET_ALL_POSTS } from '../graphql/query';

const CtmTextField = styled(TextField)({
  width: "92%",
})

const CtmButton = styled(Button)({
  width: "8%",
  marginLeft: 18,
  marginTop: 8,
  marginBottom: 8,
  marginRight: 18,
})

const ToolBar = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
})

export const Editor = ({ gql, ...rest }: any) => {
  const [title, setTitle] = useState("")
  const [value, setValue] = useState("")
  const history = useHistory()
  const refetchCounter = useRef(5)
  const [apolloError, setApolloError] = useState<ApolloError>()
  const [mutation, { loading, error, data }] = useMutation(gql.mutation, {
    update: (cache, { data }) => {
      console.log(data)
      const newPostFromResponse = data?.createPost;
      var existingPosts: any = cache.readQuery({
        query: GET_ALL_POSTS.query,
      });

      if (existingPosts && newPostFromResponse) {
        console.log("cache update")
        cache.writeQuery({
          query: GET_ALL_POSTS.query,
          data: {
            allPosts: [
              ...existingPosts?.allPosts,
              newPostFromResponse,
            ],
          },
        });
      }
    },
    onCompleted: () => {
      console.log("upload compleated")
      history.push("/admin")
    },
    onError: (error: any) => {   
      console.log(error)   
      refetchCounter.current -= 1
      if (refetchCounter.current >= 0) {
        console.log('retrying...')
        setTimeout(mutation, 2000)
      } else {
        setApolloError(error)
      }
    }
  })

  const handle = (e: any) => {
    setValue(e)
  }

  const handleChange = (e: any) => {
    setTitle(e.target.value)
  }

  const handleSubmit = () => {
    console.log(value, title)
    mutation({
      variables: {
        title: title,
        content: value,
        authorId: 1
      }
    })
  }

  const editor = () => {
    return (
      <div>
        <ToolBar mb={3}>
        <CtmTextField id="filled-basic" label="タイトル" variant="filled" defaultValue={title} onChange={e => handleChange(e)} />
          <CtmButton variant="contained" color="primary" onClick={() => { handleSubmit() }}>投稿</CtmButton>
        </ToolBar>
        <MDEditor
          height={800}
          value={value}
          onChange={(e) => handle(e)}
        />
      </div>
    )
  }
  
  return (
    <form>
      {
        apolloError?.networkError ?
          <p>ネットワークエラー</p>:
          apolloError ?
            <p>サーバーエラー</p>:
            (loading || error) ?
            <p>Loading...</p>:
            editor()
      }
    </form>
  )
}
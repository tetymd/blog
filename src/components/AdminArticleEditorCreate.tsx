import { useState } from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import MDEditor from '@uiw/react-md-editor';
import { CREATE_POST, GET_ALL_POSTS } from '../graphql/request'
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom'

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

export default function AdminArticleEditorCreate() {
  // ジェネリクスを使えばハンドラを作らなくてもいい？
  const [title, setTitle] = useState("")
  const [value, setValue] = useState("")
  const [createPost, { data }] = useMutation(CREATE_POST, {
    update (cache, { data }) {
      // We use an update function here to write the 
      // new value of the GET_ALL_TODOS query.
      const newPostFromResponse = data?.createPost;
      var existingPosts: any = cache.readQuery({
        query: GET_ALL_POSTS,
      });

      if (existingPosts && newPostFromResponse) {
        console.log("update")
        cache.writeQuery({
          query: GET_ALL_POSTS,
          data: {
            allPosts: [
              ...existingPosts?.allPosts,
              newPostFromResponse,
            ],
          },
        });
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
    createPost({
      variables: {
        title: title,
        content: value,
        authorId: 1
      }
    })
  }

  return (
    <form>
      <ToolBar mb={3}>
        <CtmTextField id="filled-basic" label="タイトル" variant="filled" defaultValue={title} onChange={e => handleChange(e)} />
        <Link to="/admin">
          <CtmButton variant="contained" color="primary" onClick={() => { handleSubmit() }}>投稿</CtmButton>
        </Link>
      </ToolBar>
      <MDEditor
        height={800}
        value={value}
        onChange={(e) => handle(e)}
      />
    </form>
  )
}
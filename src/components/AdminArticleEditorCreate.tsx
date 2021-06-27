import { useState } from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import MDEditor from '@uiw/react-md-editor';
import { CREATE_POST } from '../graphql/query'
import { useMutation } from '@apollo/client';

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
  const [createPost, { data }] = useMutation(CREATE_POST)

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
        <CtmButton variant="contained" color="primary" onClick={() => { handleSubmit() }}>投稿</CtmButton>
      </ToolBar>
      <MDEditor
        height={800}
        value={value}
        onChange={(e) => handle(e)}
      />
    </form>
  )
}
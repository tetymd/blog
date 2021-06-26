import { useState } from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import MDEditor from '@uiw/react-md-editor';
import { CREATE_POST } from '../graphql/query'
import { useMutation } from '@apollo/client';

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

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

export default function Admin() {
  // ジェネリクスを使えばハンドラを作らなくてもいい？
  const [value, setValue] = useState("")
  const [title, setTitle] = useState("")
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
    <Box>
      <AdminHeader/>
      <CtmBox pt={12} pb={12} pl={12} pr={12}>
        <form>
          <ToolBar mb={3}>
              <CtmTextField id="filled-basic" label="タイトル" variant="filled" onChange={e => handleChange(e)} />
              <CtmButton variant="contained" color="primary" onClick={() => { handleSubmit() }}>投稿</CtmButton>
          </ToolBar>
          <MDEditor
            height={800}
            value={value}
            onChange={(e) => handle(e)}
          />
        </form>
      </CtmBox>
    </Box>
  )
}
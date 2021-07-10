import { useState } from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import MDEditor from '@uiw/react-md-editor';
import { UPDATE_POST } from '../graphql/request'
import { MutationFunction, MutationResult, QueryResult, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { Mutation } from '../graphql/Query';

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

export default function AdminArticleEditor(result: QueryResult) {
  if (result.loading) {
    return <p>loding...</p>
  } else if (result.error){
    if (result.error?.networkError) return <p>ネットワークエラー</p>
    return <p>サーバーエラー</p>
  }

  return (
    <Mutation mutation={UPDATE_POST} queryResultData={result.data}>
      { PipeEditor }
    </Mutation>
  )
}

export const PipeEditor = (mutation: MutationFunction, result: MutationResult, data: any) => {
  const history = useHistory()
  console.log(data)
  console.log(data.getPostById.id)
  const handleSubmit = async({ value, title }: any) => {
    console.log(value, title)
    try {
      await mutation({
        variables: {
          title: title,
          content: value,
          postId: data.getPostById.id
        }
      })
      history.push("/admin")
    } catch (error) {
      console.log(error)
    }
  }

  return Editor(handleSubmit, data)
}

export const Editor = (handleSubmit: Function, data: any) => {
  const [title, setTitle] = useState(data.getPostById.title)
  const [value, setValue] = useState(data.getPostById.content)

  const handle = (e: any) => {
    setValue(e)
  }

  const handleChange = (e: any) => {
    setTitle(e.target.value)
  }

  return (
    <form>
      <ToolBar mb={3}>
        <CtmTextField id="filled-basic" label="タイトル" variant="filled" defaultValue={title} onChange={e => handleChange(e)} />
        <CtmButton variant="contained" color="primary" onClick={() => { handleSubmit({ title, value }) }}>更新</CtmButton>
      </ToolBar>
      <MDEditor
        height={800}
        value={value}
        onChange={(e) => handle(e)}
      />
    </form>
  )
}
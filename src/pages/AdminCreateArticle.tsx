import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import AdminArticleEditorCreate from '../components/AdminArticleEditorCreate';
import { Mutation } from '@apollo/client/react/components'
import { CREATE_POST, GET_ALL_POSTS } from '../graphql/request';
import { DataProxy, FetchResult, MutationFunction, MutationResult } from '@apollo/client';
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Link, useHistory } from 'react-router-dom';

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

const updateMutation = (cache:DataProxy, {data}: FetchResult) => {
  const newPostFromResponse = data?.createPost;
  var existingPosts: any = cache.readQuery({
    query: GET_ALL_POSTS,
    variables: {
      take: -10,
      cursor: 0
    },
  });
  console.log("data", data)
  console.log("existing", existingPosts)

  if (existingPosts && newPostFromResponse) {
    console.log("update")
    cache.writeQuery({
      query: GET_ALL_POSTS,
      variables: {
        take: -10,
        cursor: 0
      },
      data: {
        allPosts: [
          newPostFromResponse,
          ...existingPosts?.allPosts,
        ],
      },
    });
  }
}

export default function AdminCreateArticle() {
  const history = useHistory()
  const onComplete = () => {
    history.push("/admin")
  }
  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={12} pb={12} pl={12} pr={12}>
        <Mutation mutation={CREATE_POST} update={updateMutation} onCompleted={onComplete}>
          { PipeEditor }
        </Mutation>
      </CtmBox>
    </Box>
  )
}

export const PipeEditor = (mutation: MutationFunction, result: MutationResult) => {
  const handleSubmit = async({ value, title }: any) => {
    console.log(value, title)
    await mutation({
      variables: {
        title: title,
        content: value,
        authorId: 1
      }
    })
  }

  return Editor(handleSubmit)
}


export const Editor = (handleSubmit: Function) => {
  const [title, setTitle] = useState("")
  const [value, setValue] = useState("")

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
        <CtmButton variant="contained" color="primary" onClick={() => { handleSubmit({ title, value }) }}>投稿</CtmButton>
      </ToolBar>
      <MDEditor
        height={800}
        value={value}
        onChange={(e) => handle(e)}
      />
    </form>
  )
}
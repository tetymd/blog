import { useState } from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import MDEditor from '@uiw/react-md-editor';
import { GET_ALL_POSTS } from '../graphql/query'
import { useQuery } from '@apollo/client';
import AdminArticleList from '../components/AdminArticleList'
import { Auth } from 'aws-amplify'

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
  const anonymousUser = Auth.currentCredentials()
  .then(
    data => {
      console.log(data)
    }
  )
  .catch(
    err => {
      console.log(err)
    }
  )
  const { loading, data } = useQuery(GET_ALL_POSTS)

  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={10} pb={3}>
        { loading ? (
          <p>Loading...</p>
        ): (
          <AdminArticleList gqlres={data} />
        )}
      </CtmBox>
    </Box>
  )
}
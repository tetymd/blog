import { useState } from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import AdminArticleEditor from '../components/AdminArticleEditor';
import { GET_POST } from '../graphql/query'
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom'

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

export default function AdminArticlePage() {
  // ジェネリクスを使えばハンドラを作らなくてもいい？
  const params: any = useParams()
  console.log(params.id)
  const { loading, data } = useQuery(GET_POST, {
    variables: { id: params.id }
  })

  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={12} pb={12} pl={12} pr={12}>
        { loading ? (
          <p>Loading...</p>
        ): (
          <AdminArticleEditor gqlres={data} />
        )}
      </CtmBox>
    </Box>
  )
}





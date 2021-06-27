import { useState } from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import AdminArticleEditorCreate from '../components/AdminArticleEditorCreate';

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

export default function AdminCreateArticle() {
  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={12} pb={12} pl={12} pr={12}>
        <AdminArticleEditorCreate />
      </CtmBox>
    </Box>
  )
}
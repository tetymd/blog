import {
  styled,
  Box,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import { Editor } from '../components/AdminArticleEditorCreate';
import { CREATE_POST } from '../graphql/query';

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

export default function AdminCreateArticle() {
  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={12} pb={12} pl={12} pr={12}>
        <Editor gql={CREATE_POST} />
      </CtmBox>
    </Box>
  )
}
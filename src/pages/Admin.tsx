import {
  styled,
  Box,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import { GET_ALL_POSTS } from '../graphql/query'
import { GqlQurey } from '../components/GqlQuery'
import AdminArticleList from '../components/AdminArticleList'
import { Auth } from 'aws-amplify'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

export default function Admin() {
  

  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={10} pb={3}>
        <GqlQurey gql={GET_ALL_POSTS} component={AdminArticleList}/>
      </CtmBox>
    </Box>
  )
}
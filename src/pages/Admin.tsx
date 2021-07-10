import {
  styled,
  Box,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import { GET_ALL_POSTS } from '../graphql/request'
import AdminArticleList from '../components/AdminArticleList'
import { Query } from '../graphql/Query';

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

export default function Admin() {
  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={10} pb={3}>
        <Query query={GET_ALL_POSTS} errorPolicy="all" notifyOnNetworkStatusChange={true} >
          { AdminArticleList }
        </Query>
      </CtmBox>
    </Box>
  )
}
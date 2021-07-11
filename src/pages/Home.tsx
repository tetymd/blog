import {
  styled,
  Box,
} from '@material-ui/core'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import ArticleList from '../components/ArticleList'
import { GET_ALL_POSTS } from '../graphql/request'
import { Query } from '../graphql/Query';

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

export default function Home() {
  return (
    <Box>
      <AppHeader/>
      <CtmBox pt={10} pb={3}>
        <Query query={GET_ALL_POSTS} variables={{ take: 10, cursor: 1 }} errorPolicy="all" notifyOnNetworkStatusChange={true} >
          { ArticleList }
        </Query>
      </CtmBox>
      <AppFooter/>
    </Box>
  )
}


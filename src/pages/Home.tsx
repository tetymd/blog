import {
  styled,
  Box,
} from '@material-ui/core'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import ArticleList from '../components/ArticleList'
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../graphql/query'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

export default function Home() {
  const { loading, data } = useQuery(GET_ALL_POSTS)
  console.log(loading)
  console.log(data)

  return (
    <Box>
      <AppHeader/>
      <CtmBox pt={10} pb={3}>
        { loading ? (
          <p>Loading...</p>
          ): (
          <ArticleList gqlres={data}/>
          )
        }
      </CtmBox>
      <AppFooter/>
    </Box>
  )
}
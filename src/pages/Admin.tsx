import {
  styled,
  Box,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import { GET_ALL_POSTS } from '../graphql/query'
import { useQuery } from '@apollo/client';
import AdminArticleList from '../components/AdminArticleList'
import { Auth } from 'aws-amplify'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

export default function Admin() {
  const anonymousUser = async () => (
    await Auth.currentCredentials()
  ).sessionToken

  console.log(anonymousUser)
  
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
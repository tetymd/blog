import { useState, useRef } from 'react'
import {
  styled,
  Box,
} from '@material-ui/core'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import ArticleList from '../components/ArticleList'
import { useQuery, ApolloError } from '@apollo/client';
import { GET_ALL_POSTS } from '../graphql/query'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

type GqlResult = {
  [key: string]: any
}

export default function Home() {
  const refetchCounter = useRef(5)
  const [apolloError, setApolloError] = useState<ApolloError>()
  const { loading, error, data, refetch } = useQuery(GET_ALL_POSTS, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.log("data: ", data)
      console.log("error:", error)
      console.log("loading:", loading)
      console.log(refetchCounter.current)
      console.log(apolloError?.networkError)
      
      refetchCounter.current -= 1
      if (refetchCounter.current >= 0) {
        setTimeout(refetch, 1500)
      } else {
        setApolloError(error)
      }
    }
  })

  const result: GqlResult | undefined = data
  console.log(result)

  console.log("data: ", data)
  console.log("NetworkError:", error?.networkError)
  console.log("graphQLError:", error?.graphQLErrors)
  console.log("loading:", loading)
  console.log("result: ", result?.["allPosts"])

  return (
    <Box>
      <AppHeader/>
      <CtmBox pt={10} pb={3}>
        {
          apolloError?.networkError ?
            <p>ネットワークエラー</p>:
            apolloError ?
              <p>サーバーエラー</p>:
              (loading || data == undefined || result?.["allPosts"] == null) ?
                <p>Loading...</p>:
                <ArticleList gqlres={data}/>
        }
      </CtmBox>
      <AppFooter/>
    </Box>
  )
}
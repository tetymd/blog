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

export const GqlQurey = ({ gql, component, ...rest }: any) => {
  const refetchCounter = useRef(5)
  const [apolloError, setApolloError] = useState<ApolloError>()
  const { loading, data, refetch } = useQuery(gql.query, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {      
      refetchCounter.current -= 1
      if (refetchCounter.current >= 0) {
        console.log('refetching...')
        setTimeout(refetch, 1500)
      } else {
        setApolloError(error)
      }
    }
  })

  const result: GqlResult | undefined = data

  return (
    <Box>
      {
        apolloError?.networkError ?
          <p>ネットワークエラー</p>:
          apolloError ?
            <p>サーバーエラー</p>:
            (loading || data == undefined || result?.[gql.name] == null) ?
              <p>Loading...</p>:
              component(result)
      }
    </Box>
  )
}

export default function Home() {
  return (
    <Box>
      <AppHeader/>
      <CtmBox pt={10} pb={3}>
        <GqlQurey gql={GET_ALL_POSTS} component={ArticleList} />
      </CtmBox>
      <AppFooter/>
    </Box>
  )
}
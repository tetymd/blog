import { useState, useRef } from 'react'
import { useQuery, ApolloError, QueryHookOptions } from '@apollo/client';


type GqlResult = {
  [key: string]: any
}

export const GqlQurey = ({ gql, component, ...rest }: any) => {
  let option: QueryHookOptions = {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    onError: (error: any) => {      
      refetchCounter.current -= 1
      if (refetchCounter.current >= 0) {
        console.log('refetching...')
        setTimeout(refetch, 2000)
      } else {
        setApolloError(error)
      }
    }
  }
  console.log("rest:", rest)
  if (rest.variables) option.variables = rest.variables

  const refetchCounter = useRef(5)
  const [apolloError, setApolloError] = useState<ApolloError>()
  const { loading, data, refetch } = useQuery(gql.query, option)
  console.log("data:", data)
  const result: GqlResult | undefined = data

  return (
    <div>
      {
        apolloError?.networkError ?
          <p>ネットワークエラー</p>:
          apolloError ?
            <p>サーバーエラー</p>:
            (loading || data == undefined || result?.[gql.name] == null) ?
              <p>Loading...</p>:
              component(result)
      }
    </div>
  )
}
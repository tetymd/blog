import { createContext, useEffect, useReducer, useState } from 'react'
import Routing from './Routing'
import { styled, Box } from '@material-ui/core'

import Amplify, { Auth } from 'aws-amplify'
import { createAuthLink, AuthOptions, AUTH_TYPE  } from 'aws-appsync-auth-link'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  InMemoryCacheConfig,
} from '@apollo/client';

const oauth = {
  domain: 'tetymd.auth.ap-northeast-1.amazoncognito.com',
  scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
  redirectSignIn: 'http://localhost:3000/admin',
  redirectSignOut: 'http://localhost:3000/signin',
  responseType: 'code'
}

Amplify.configure({
  region: process.env.REACT_APP_AWS_REGION,
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
  oauth: oauth
})

const url = `${process.env.REACT_APP_APPSYNC_ENDPOINT}`
const region = `${process.env.REACT_APP_AWS_REGION}`
const auth: AuthOptions = {
  type: AUTH_TYPE.AWS_IAM,
  credentials: () => Auth.currentCredentials() 
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth })
]);

const cacheConfig: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        allPosts: {
          read(existing) {
            console.log("existing:", existing)
            return existing
          },
          merge(existing = [], incoming: any|undefined[]) {
            console.log("existing:", existing)
            console.log("incoming:", incoming)
            return incoming ? [ ...existing, ...incoming ] : [ ...existing ]
          }
        }
      }
    }
  }
}

const client = new ApolloClient({
  link: link,
  // uri: 'http://localhost:4000',
  cache: new InMemoryCache(cacheConfig)
})

const CustomBox = styled(Box)({
  backgroundColor: 'rgb(240,240,240)',
})

type State = {
  isSignIn: Boolean
}

type Action = { type: 'signin' } | { type: 'signout' }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'signin':
      return {
        ...state,
        isSignIn: true
      }
    case 'signout':
      return {
        ...state,
        isSignIn: false
      }
    default:
      return state
  }
}

export const AuthContext = createContext({} as {
  state: State,
  dispatch: React.Dispatch<Action>
})

const AuthProvider = ({children, state, dispatch}: any) => {
  const [loading, setLoading] = useState(false)
  console.log(state)

  useEffect( () => {
    const check = async() => {
      try {
        const r = await Auth.currentSession()
        console.log(r)
        dispatch({ type: 'signin' })
        setLoading(true)
      } catch (error) {
        console.log(error)
        dispatch({ type: 'signout' })
        setLoading(true)
      }
    }
    check()
  }, [])

  return (
    <Box>
      {
        loading ? (
          <AuthContext.Provider value={{state, dispatch}}>
            {children}
          </AuthContext.Provider>
        ) : (
          <div></div>
        )
      }
    </Box>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, { isSignIn: false })
  return (
    <CustomBox>
      <AuthProvider state={state} dispatch={dispatch}>
        <ApolloProvider client={client}>
          <Routing />
        </ApolloProvider>
      </AuthProvider>
    </CustomBox>
  );
}

export default App

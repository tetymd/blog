import { createContext, useState, useEffect, useReducer, useContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
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
} from '@apollo/client';

Amplify.configure({
  // (required) only for Federated Authentication - Amazon Cognito Identity Pool ID
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,

  // (required)- Amazon Cognito Region
  region: process.env.REACT_APP_AWS_REGION,

  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
})

const url = `${process.env.REACT_APP_APPSYNC_ENDPOINT}`
const region = `${process.env.REACT_APP_AWS_REGION}`
const auth: AuthOptions = {
  type: AUTH_TYPE.AWS_IAM,
  credentials: () => Auth.currentCredentials() 
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }),
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

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

const initialState = { isSignIn: false }

const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AuthContext.Provider value={{state, dispatch}}>
    {children}
  </AuthContext.Provider>
}

function App() {
  return (
    <CustomBox>
      <AuthProvider>
        <ApolloProvider client={client}>
          <Routing />
        </ApolloProvider>
      </AuthProvider>
    </CustomBox>
  );
}



export default App

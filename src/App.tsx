import React, { useContext, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import { styled, Box } from '@material-ui/core'
import Home from './pages/Home'
import ArticlePage from './pages/Article'
import Admin from './pages/Admin'
import AdminArticlePage from './pages/AdminArticle'
import AdminCreateArticle from './pages/AdminCreateArticle'
import AdminAuth from './pages/AdminAuth'

import Amplify, { Auth } from 'aws-amplify'

Amplify.configure({
  // (required) only for Federated Authentication - Amazon Cognito Identity Pool ID
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,

  // (required)- Amazon Cognito Region
  region: process.env.REACT_APP_AWS_REGION,

  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
})


const CustomBox = styled(Box)({
  backgroundColor: 'rgb(240,240,240)',
})

function App() {
  const [cred, setCred] = useState("")
  
  const _ = (async () => {
    const c = await Auth.currentCredentials()
    setCred(c.sessionToken)
  })()

  console.log(cred)

  return (
    <CustomBox>
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/articles/:id" component={ArticlePage} />
        <Route exact path="/admin/signin" component={AdminAuth} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/admin/articles/:id" component={AdminArticlePage} />
        <Route exact path="/admin/newarticle" component={AdminCreateArticle} />
      </Router>
    </CustomBox>
  );
}

export default App;

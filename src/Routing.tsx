import { createContext, useState, useEffect, useReducer, useContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Home from './pages/Home'
import ArticlePage from './pages/Article'
import Admin from './pages/Admin'
import AdminArticlePage from './pages/AdminArticle'
import AdminCreateArticle from './pages/AdminCreateArticle'
import AdminAuth from './pages/AdminAuth'
import PrivateRoute from './components/Authen'
import { Auth } from 'aws-amplify'
import { AuthContext } from './App'

export default function Routing() {
  console.log("hello")
  const { state, dispatch } = useContext(AuthContext)
  useEffect(() => {
    if (state.isSignIn === false) {
      const _ = (async() => {
        try {
          const session = await Auth.currentSession()
          console.log(session)
          dispatch({
            type: 'signin'
          })
        } catch (error) {
          console.log("error:", error)
          dispatch({
            type: 'signout'
          })
        }
      })()
    }
  }, [state.isSignIn])

  return (
    <Router>
      <Switch>
        <Route exact path="/articles/:id" component={ArticlePage} />
        <Route exact path="/signin" component={AdminAuth} />
        <Route exact path="/" component={Home} />
        <Route exact path={process.env.REACT_APP_ADMIN_URL+"/new"} component={AdminCreateArticle} />
        <PrivateRoute exact path={process.env.REACT_APP_ADMIN_URL+"/articles/:id"} component={AdminArticlePage} />
        <PrivateRoute exact path={process.env.REACT_APP_ADMIN_URL} component={Admin} />
      </Switch>
    </Router>
  )
}
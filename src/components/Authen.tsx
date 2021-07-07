import { useState, useEffect, useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { AuthContext } from '../App'

function PrivateRoute({ component, ...rest }: any) {
  const { state } = useContext(AuthContext)
  const Component = component
  return (
    <Route
      {...rest}
      render={() =>
        state.isSignIn ?
        <Component />:
        <Redirect
          to="/signin"
        />
      }
    />
  );
}

export default PrivateRoute
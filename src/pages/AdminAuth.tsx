import { useState, useContext, useReducer } from 'react'
import {
  styled,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import { Redirect, useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { AuthContext } from '../App'

const CtmBox = styled(Box)({
  minHeight: "100vh",
})

const CtmCard = styled(Card)({
  width: "60%",
  height: 300,
  margin: "0 auto"
})

const CtmTypography = styled(Typography)({
  textAlign: "center",
})

const options = {
  customProvider: 'Facebook',
  customState: ""
}

const facebookLogin = async(dispatch: any) => {
  try {
    await Auth.federatedSignIn(options)
    dispatch({ type: 'signin'})
  } catch (error) {
    console.log(error)
  }
}

export default function AdminAuth() {
  const { state, dispatch } = useContext(AuthContext)

  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={10} pb={3}>
        <CtmCard>
          <CardContent>
            <Button variant="contained" color="primary" onClick={() => { facebookLogin(dispatch) }}>サインイン</Button>
          </CardContent>
        </CtmCard>
      </CtmBox>
    </Box>
  )
}
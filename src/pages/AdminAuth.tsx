import { useState } from 'react'
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
import { Redirect } from 'react-router-dom'
import { Auth } from 'aws-amplify'

const CtmBox = styled(Box)({
  minHeight: "100vh",
})

const CtmTextField = styled(TextField)({
  width: "92%",
})

const CtmButton = styled(Button)({
  width: "8%",
  marginLeft: 18,
  marginTop: 8,
  marginBottom: 8,
  marginRight: 18,
})

const CtmCard = styled(Card)({
  width: "60%",
  height: 300,
  margin: "0 auto"
})

const CtmTypography = styled(Typography)({
  textAlign: "center",
})

export default function AdminAuth() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSignIn, setIsSignIn] = useState(false)

  const handleChangeUserName = (e: any) => {
    setUsername(e.target.value)
  }

  const handleChangePassword = (e: any) => {
    setPassword(e.target.value)
  }

  const _ = (async () => {
    try {
      const session = await Auth.currentSession()
      console.log(session)
      setIsSignIn(true)
      // const user = await Auth.currentAuthenticatedUser()
      // console.log(user)
    } catch (error) {
      console.log(error)
      setIsSignIn(false)
    }
  })()

  const signIn = async (username: string, passwordS: string) => {
    const user = await Auth.signIn(username, password)
    console.log(user)
    Auth.currentSession()
    .then(
      data => {
        console.log(data)
      }
    )
    setIsSignIn(true)
  }

  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={10} pb={3}>
        { isSignIn ? <Redirect to="/admin"/>:
          <CtmCard>
            <CardContent>
              <Grid container direction="column" justify="center" alignItems="center" spacing={2} >
                <Grid item >
                  <CtmTypography variant="h4">サインイン</CtmTypography>
                </Grid>
                <Grid item >
                  <TextField label="ユーザー名" variant="filled" fullWidth onChange={e => handleChangeUserName(e)} />
                </Grid>
                <Grid item >
                  <TextField label="パスワード" variant="filled" fullWidth type="password" autoComplete="current-password" onChange={e => handleChangePassword(e)} />
                </Grid>
                <Grid item >
                  <Button variant="contained" color="primary" onClick={() => { signIn(username, password) }}>サインイン</Button>
                </Grid>
              </Grid>
            </CardContent>
          </CtmCard>
        }
      </CtmBox>
    </Box>
  )
}
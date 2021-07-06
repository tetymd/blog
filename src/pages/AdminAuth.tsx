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

export default function AdminAuth() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { state, dispatch } = useContext(AuthContext)
  const history = useHistory()

  const handleChangeUserName = (e: any) => {
    setUsername(e.target.value)
  }

  const handleChangePassword = (e: any) => {
    setPassword(e.target.value)
  }

  const signIn = async () => {
    try {
      const user = await Auth.signIn(username, password)
      console.log(user, state)
      dispatch({ type: 'signin' })
      console.log(state)
      history.push("/admin")
    } catch (error) {
      console.log("error:", error)
    }
  }

  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={10} pb={3}>
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
                <Button variant="contained" color="primary" onClick={() => { signIn() }}>サインイン</Button>
              </Grid>
            </Grid>
          </CardContent>
        </CtmCard>
      </CtmBox>
    </Box>
  )
}
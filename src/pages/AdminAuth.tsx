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
                <TextField label="ユーザー名" variant="filled" fullWidth />
              </Grid>
              <Grid item >
                <TextField label="パスワード" variant="filled" fullWidth type="password" autoComplete="current-password" />
              </Grid>
              <Grid item >
                <Button variant="contained" color="primary">サインイン</Button>
              </Grid>
            </Grid>
          </CardContent>
        </CtmCard>
      </CtmBox>
    </Box>
  )
}
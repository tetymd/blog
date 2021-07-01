import {
  styled,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'

const CtmAppBar = styled(AppBar)({
})

const CtmTypography = styled(Typography)({
  flexGrow: 1
})

const CtmBox = styled(Box)({
})

export default function AdminHeader() {
  const history = useHistory()

  const handleClick = () => {
    Auth.signOut()
    history.push("/admin/signin")
  }

  return (
    <CtmAppBar position="fixed">
      <Toolbar>
        <CtmTypography variant="h6">
          <Link to="/admin">
            TECHI BLOG Admin
          </Link>
        </CtmTypography>
        <Link to="/admin/newarticle">
          <Typography variant="subtitle1">
            新規作成
          </Typography>
        </Link>
        <Typography gutterBottom variant="caption" onClick={() => {handleClick()}}>
            サインアウト
        </Typography>
      </Toolbar>
    </CtmAppBar>
  )
}
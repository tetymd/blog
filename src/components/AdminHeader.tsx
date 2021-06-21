import {
  styled,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Link } from 'react-router-dom'

const CtmAppBar = styled(AppBar)({
})

const CtmTypography = styled(Typography)({
  textAlign: "center",
  flexGrow: 1
})

export default function AdminHeader() {
  return (
    <CtmAppBar position="fixed">
      <Toolbar>
        <CtmTypography variant="h6">
          <Link to="/admin">
            TECHI BLOG Admin
          </Link>
        </CtmTypography>
      </Toolbar>
    </CtmAppBar>
  )
}
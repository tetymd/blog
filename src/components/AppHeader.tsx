import {
  styled,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Link } from 'react-router-dom'

const CtmAppBar = styled(AppBar)({
  backgroundColor: "rgb(50, 50, 50)",
})

const CtmTypography = styled(Typography)({
  textAlign: "center",
  flexGrow: 1
})

export default function AppHeader() {
  return (
    <CtmAppBar position="fixed">
      <Toolbar>
        <CtmTypography variant="h6">
          <Link to="/">
            TECHI BLOG
          </Link>
        </CtmTypography>
      </Toolbar>
    </CtmAppBar>
  )
}
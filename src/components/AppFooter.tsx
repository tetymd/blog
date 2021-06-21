import {
  styled,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Link } from 'react-router-dom'

const CtmAppBar = styled(AppBar)({
  height: 100,
  backgroundColor: "rgb(90, 90, 90)",
})

const CtmTypography = styled(Typography)({
  flexGrow: 1
})

export default function AppFooter() {
  return (
    <CtmAppBar position="static">
      <Toolbar>
        <CtmTypography variant="caption">
          <Link to="/">
            TECHI BLOG
          </Link>
        </CtmTypography>
      </Toolbar>
    </CtmAppBar>
  )
}
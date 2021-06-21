import {
  styled,
  Box,
} from '@material-ui/core'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import ArticleList from '../components/ArticleList'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

export default function Home() {
  return (
    <Box>
      <AppHeader/>
      <CtmBox pt={10} pb={3}>
        <ArticleList/>
      </CtmBox>
      <AppFooter/>
    </Box>
  )
}
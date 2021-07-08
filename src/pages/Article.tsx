import {
  styled,
  Grid,
  Box,
} from '@material-ui/core'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import ArticleCard from '../components/ArticleCard'
import { GET_POST } from '../graphql/query'
import { GqlQurey } from '../components/GqlQuery'
import { useParams } from 'react-router'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

const GridItem = styled(Grid)({
  width: '100%'
})

export default function ArticlePage() {
  const params = useParams<{} | any>()
  return (
    <Box>
      <AppHeader/>
      <CtmBox pt={10} pb={3}>
        <Grid container direction="column" alignItems="center" justify="center">
          <GridItem item xs={11} sm={9} md={7} lg={7} xl={5}>
            <GqlQurey gql={GET_POST} variables={ { id: params.id } } component={ArticleCard} />
          </GridItem>
        </Grid>
      </CtmBox>
      <AppFooter/>
    </Box>
  )
}
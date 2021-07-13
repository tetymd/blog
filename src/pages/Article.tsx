import {
  styled,
  Grid,
  Box,
} from '@material-ui/core'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import ArticleCard from '../components/ArticleCard'
import { useQuery } from '@apollo/client'
import { GET_POST } from '../graphql/request'
import { useParams } from 'react-router-dom'
import { Query } from '../graphql/Query'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

const GridItem = styled(Grid)({
  width: '100%'
})

export default function ArticlePage() {
  const params: any = useParams()
  console.log(params.id)

  return (
    <Box>
      <AppHeader/>
      <CtmBox pt={10} pb={3}>
        <Grid container direction="column" alignItems="center" justify="center">
          <GridItem item xs={11} sm={9} md={7} lg={7} xl={5}>
            <Query query={GET_POST} variables={{ id: params.id }} errorPolicy="all" notifyOnNetworkStatusChange={true} >
                { ArticleCard }
            </Query>
          </GridItem>
        </Grid>
      </CtmBox>
      <AppFooter/>
    </Box>
  )
}
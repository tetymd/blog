import {
  styled,
  Grid,
  Box,
} from '@material-ui/core'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import ArticleCard from '../components/ArticleCard'
import { useQuery } from '@apollo/client';
import { GET_POST } from '../graphql/query'
import { useParams } from 'react-router-dom'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

const GridItem = styled(Grid)({
  width: '100%'
})

export default function ArticlePage() {
  const params: any = useParams()
  console.log(params.id)
  const { loading, data } = useQuery(GET_POST, {
    variables: { id: params.id },
  })

  console.log(loading)
  console.log(data)

  return (
    <Box>
      <AppHeader/>
      <CtmBox pt={10} pb={3}>
        <Grid container direction="column" alignItems="center" justify="center">
          <GridItem item xs={11} sm={9} md={7} lg={7} xl={5}>
            { loading ? (
              <p>Loading...</p>
            ): (
              <ArticleCard gqlres={data} />
            )}
          </GridItem>
        </Grid>
      </CtmBox>
      <AppFooter/>
    </Box>
  )
}
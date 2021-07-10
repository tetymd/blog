import { QueryResult } from '@apollo/client'
import {
  styled,
  Grid,
  Box,
} from '@material-ui/core'
import AdminCard from './AdminCard'

const GridItem = styled(Grid)({
  width: '100%'
})

function AdminArticleList(result: QueryResult) {
  if (result.loading) {
    return <p>loding...</p>
  } else if (result.error){
    if (result.error?.networkError) return <p>ネットワークエラー</p>
    return <p>サーバーエラー</p>
  }

  let items: any[] = []
  for(var i in result.data.allPosts){
    console.log(result.data.allPosts[i])
    items.push(
      <GridItem item xs={10} sm={9} md={6} lg={6} xl={5} key={i}>
        <Box m={0.8}>
          <AdminCard article={result.data.allPosts[i]} />
        </Box>
      </GridItem>
    )
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      {items}
    </Grid>
  )
}

export default AdminArticleList
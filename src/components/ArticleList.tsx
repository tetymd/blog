import {
  styled,
  Grid,
  Box,
} from '@material-ui/core'
import MediaCard from './Card'
import { Articles } from '../types'

const GridItem = styled(Grid)({
  width: '100%'
})

function ArticleList(props: any) {
  console.log(props.gqlres.allPosts)
  let items: any[] = []

  for(var i in props.gqlres.allPosts){
    console.log(props.gqlres.allPosts[i])
    items.push(
      <GridItem item xs={10} sm={9} md={6} lg={6} xl={5} key={i}>
        <Box m={0.8}>
          <MediaCard article={props.gqlres.allPosts[i]} />
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

export default ArticleList
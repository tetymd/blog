import {
  styled,
  Grid,
  Box,
} from '@material-ui/core'
import MediaCard from './Card'

const GridItem = styled(Grid)({
  width: '100%'
})

function ArticleList(props: any) {
  console.log(props)
  let items: any[] = []

  for(var i in props.allPosts){
    console.log(props.allPosts[i])
    items.push(
      <GridItem item xs={10} sm={9} md={6} lg={6} xl={5} key={i}>
        <Box m={0.8}>
          <MediaCard article={props.allPosts[i]} />
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
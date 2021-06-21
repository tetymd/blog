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

function ArticleList() {
  const articles: Articles = {
    items: [
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "Reactに入門してみた",
        body: "",
        createdAt: "2021/06/17"
      },
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "docker compose up -d",
        body: "",
        createdAt: "2021/06/17"
      },
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "Pythonでデータ分析",
        body: "",
        createdAt: "2021/06/17"
      },
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "Reactに入門してみた",
        body: "",
        createdAt: "2021/06/17"
      },
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "docker compose up -d",
        body: "",
        createdAt: "2021/06/17"
      },
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "Pythonでデータ分析",
        body: "",
        createdAt: "2021/06/17"
      },
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "Reactに入門してみた",
        body: "",
        createdAt: "2021/06/17"
      },
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "docker compose up -d",
        body: "",
        createdAt: "2021/06/17"
      },
      {
        article_id: "gaohkdaf;alekrhgja",
        title: "Pythonでデータ分析",
        body: "",
        createdAt: "2021/06/17"
      },
    ],
    total_items: 9
  }

  let items: any[] = []

  for(var i in articles.items){
    items.push(
      <GridItem item xs={10} sm={9} md={6} lg={6} xl={5}>
        <Box m={0.8}>
          <MediaCard article={articles.items[i]} />
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
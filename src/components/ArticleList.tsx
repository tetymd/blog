import { ApolloCache, QueryResult } from '@apollo/client'
import {
  styled,
  Grid,
  Box,
  Button,
} from '@material-ui/core'
import { useRef, useState } from 'react'
import MediaCard from './Card'

const GridItem = styled(Grid)({
  width: '100%'
})

const getMore = async(fetchMore: any, cursor: any) => {
  const r = await fetchMore({
    variables: {
      take: -10,
      cursor: cursor.current
    },
  });
  console.log(r)
}

export default function ArticleList(result: QueryResult) {
  const cursor = useRef(1)
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
          <MediaCard article={result.data.allPosts[i]} />
        </Box>
      </GridItem>
    )
  }

  const handleSubmit = () => {
    cursor.current = +result.data.allPosts.slice(-1)[0].id-10
    if (cursor.current < 1) cursor.current = 1
    console.log("cursor:", cursor.current)
    getMore(result.fetchMore, cursor)
  }

  return (
    <Box>
      <Grid container direction="column" alignItems="center" justify="center">
        {items}
        <Button onClick={ () => { handleSubmit() }}>もっと読む</Button>
      </Grid>
    </Box>
  )
}
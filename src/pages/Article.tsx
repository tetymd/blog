import {
  styled,
  Grid,
  Box,
} from '@material-ui/core'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import ArticleCard from '../components/ArticleCard'
import { Article } from '../types'
import { useQuery, gql } from '@apollo/client';
import { GET_POST } from '../graphql/query'
import { useParams } from 'react-router-dom'

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

const GridItem = styled(Grid)({
  width: '100%'
})

const md = `
# Hello World!
# Dockerに入門してみた
## Hello World!
### Hello World!
#### Hello World!
##### Hello World!
###### Hello World!

Hello world!

こんにちは　ごきげんよう

[link](https://google.com)


https://qiita.com/xrxoxcxox/items/17e0762d8e69c1ef208f


1. 番号付きリスト1
    1. 番号付きリスト1_1
    1. 番号付きリスト1_2
1. 番号付きリスト2
1. 番号付きリスト3


- リスト1
    - ネスト リスト1_1
        - ネスト リスト1_1_1
        - ネスト リスト1_1_2
    - ネスト リスト1_2
- リスト2
- リスト3


> お世話になります。xxxです。
> 
> ご連絡いただいた、バグの件ですが、仕様です。
>> お世話になります。 yyyです。
>> 
>> あの新機能バグってるっすね


~~~ruby
　class Hoge
　  def hoge
　    print 'hoge'
　  end
　end
~~~


Lists

- [ ] todo
- [x] done


|header1|header2|header3|
|:--|--:|:--:|
|align left|align right|align center|
|a|b|c|

`

const article: Article = {
  id: "gaohkdaf;alekrhgja",
  title: "Reactに入門してみた",
  content: md,
  authorId: 1,
  createdAt: "2021/06/17",
  updateAt: "",
  published: true
}

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
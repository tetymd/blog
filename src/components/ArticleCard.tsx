import { QueryResult } from '@apollo/client';
import {
  styled,
  Card,
  CardContent,
  Box,
  Typography,
} from '@material-ui/core'
import MDEditor from '@uiw/react-md-editor';

const CtmCard = styled(Card)({
  width: "100%",
})

const CtmTypography = styled(Typography)({
  fontWeight: 800,
})

export default function ArticleCard(result: QueryResult) {
  console.log(result) 
  if (result.loading) {
    return <p>loding...</p>
  } else if (result.error){
    if (result.error?.networkError) return <p>ネットワークエラー</p>
    return <p>サーバーエラー</p>
  }
  const date: Date = new Date(result.data.getPostById.createdAt)

  return (
    <CtmCard>
      <CardContent>
        <Box mt={2}>
          <CtmTypography gutterBottom variant="h4">
            {result.data.getPostById.title}
          </CtmTypography>
        </Box>
        <Box mr={3}>
          <Typography gutterBottom variant="caption" component="p" align="right">
            {date.toLocaleDateString()}
          </Typography>
        </Box>
        <MDEditor.Markdown source={result.data.getPostById.content}/>
      </CardContent>
    </CtmCard>
  )
}
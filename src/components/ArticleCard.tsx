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

export default function ArticleCard(props: any) {
  console.log(props) 
  const date: Date = new Date(props.getPostById.createdAt)

  return (
    <CtmCard>
      <CardContent>
        <Box mt={2}>
          <CtmTypography gutterBottom variant="h4">
            {props.getPostById.title}
          </CtmTypography>
        </Box>
        <Box mr={3}>
          <Typography gutterBottom variant="caption" component="p" align="right">
            {date.toLocaleDateString()}
          </Typography>
        </Box>
        <MDEditor.Markdown source={props.getPostById.content}/>
      </CardContent>
    </CtmCard>
  )
}
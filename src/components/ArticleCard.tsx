import {
  styled,
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
} from '@material-ui/core'
import MDEditor from '@uiw/react-md-editor';

const CtmCard = styled(Card)({
  width: "100%",
})

const CtmCardMedia = styled(CardMedia)({
  width: "100%",
  height: 340
})

const CtmTypography = styled(Typography)({
  fontWeight: 800,
})

export default function ArticleCard(props: any) {
  console.log(props.gqlres.getPostById) 
  const date: Date = new Date(props.gqlres.getPostById.createdAt)

  return (
    <CtmCard>
      <CtmCardMedia
        image={`${process.env.PUBLIC_URL}/logo512.png`}
        title="Contemplative Reptile"
      />
      <CardContent>
        <Box mt={2}>
          <CtmTypography gutterBottom variant="h4">
            {props.gqlres.getPostById.title}
          </CtmTypography>
        </Box>
        <Box mr={3}>
          <Typography gutterBottom variant="caption" component="p" align="right">
            {date.toLocaleDateString()}
          </Typography>
        </Box>
        <MDEditor.Markdown source={props.gqlres.getPostById.content}/>
      </CardContent>
    </CtmCard>
  )
}
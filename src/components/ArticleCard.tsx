import {
  styled,
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
} from '@material-ui/core'
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import MDEditor from '@uiw/react-md-editor';
import { Article } from '../types'


let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

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

type Props = {
  article: Article
}


export default function ArticleCard(props: Props) {
  return (
    <CtmCard>
      <CtmCardMedia
        image={`${process.env.PUBLIC_URL}/logo512.png`}
        title="Contemplative Reptile"
      />
      <CardContent>
        <Box mt={2}>
          <CtmTypography gutterBottom variant="h4">
            {props.article.title}
          </CtmTypography>
        </Box>
        <Box mr={3}>
          <Typography gutterBottom variant="caption" component="p" align="right">
            {props.article.createdAt}
          </Typography>
        </Box>
        <MDEditor.Markdown source={props.article.body}/>
      </CardContent>
    </CtmCard>
  )
}
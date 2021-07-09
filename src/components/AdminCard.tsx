import {
  styled,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Article } from '../types' 

type Props = {
  article: Article
}

const CustomCard = styled(Card)({
  width: '100%'
})

export default function AdminCard(props: Props) {
  const date: Date = new Date(props.article.createdAt)

  return (
    <CustomCard>
      <CardActionArea>
        <Link to={`/admin/articles/${props.article.id}`}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h6">
              {props.article.title}
            </Typography>
            <Typography gutterBottom variant="caption" component="p" color="textSecondary" align="right">
              {date.toLocaleDateString()}
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
    </CustomCard>
  )
}
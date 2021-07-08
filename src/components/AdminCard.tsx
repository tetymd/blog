import {
  styled,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Article } from '../types' 

const CustomCard = styled(Card)({
  width: '100%'
})

export default function AdminCard(props: any) {
  const date: Date = new Date(props.createdAt)

  return (
    <CustomCard>
      <CardActionArea>
        <Link to={`/admin/articles/${props.id}`}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h6">
              {props.title}
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
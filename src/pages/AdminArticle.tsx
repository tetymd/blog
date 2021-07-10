import {
  styled,
  Box,
  Grid,
} from '@material-ui/core'
import AdminHeader from '../components/AdminHeader'
import AdminArticleEditor from '../components/AdminArticleEditor';
import DeletePostButton from '../components/DeletePostButton';
import { GET_POST } from '../graphql/request'
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom'
import { Query } from '../graphql/Query';

const CtmBox = styled(Box)({
  minHeight: "100vh"
})

export default function AdminArticlePage() {
  // ジェネリクスを使えばハンドラを作らなくてもいい？
  const params: any = useParams()
  console.log(params.id)

  return (
    <Box>
      <AdminHeader/>
      <CtmBox pt={12} pb={12} pl={12} pr={12}>
        <Grid container direction="column" spacing={2}>
          <Grid item lg={12}>
            <Query query={GET_POST} variables={{ id: params.id }} errorPolicy="all" notifyOnNetworkStatusChange={true} >
              { AdminArticleEditor }
            </Query>
          </Grid>
          <Grid container item justify="flex-end">
            <Link to="/admin">
              <DeletePostButton />
            </Link>
          </Grid>
        </Grid>
      </CtmBox>
    </Box>
  )
}
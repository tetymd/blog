import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import { styled, Box } from '@material-ui/core'
import Home from './pages/Home'
import ArticlePage from './pages/Article'
import Admin from './pages/Admin'
import AdminArticlePage from './pages/AdminArticle'
import AdminCreateArticle from './pages/AdminCreateArticle'
import AdminAuth from './pages/AdminAuth'

const CustomBox = styled(Box)({
  backgroundColor: 'rgb(240,240,240)',
})

function App() {
  return (
    <CustomBox>
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/articles/:id" component={ArticlePage} />
        <Route exact path="/admin/signin" component={AdminAuth} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/admin/articles/:id" component={AdminArticlePage} />
        <Route exact path="/admin/newarticle" component={AdminCreateArticle} />
      </Router>
    </CustomBox>
  );
}

export default App;

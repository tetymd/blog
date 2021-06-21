import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import { styled, Box } from '@material-ui/core'
import Home from './pages/Home'
import ArticlePage from './pages/Article'
import Admin from './pages/Admin'

const CustomBox = styled(Box)({
  backgroundColor: 'rgb(240,240,240)',
})

function App() {
  return (
    <CustomBox>
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/articles/:id" component={ArticlePage} />
        <Route exact path="/admin" component={Admin} />
      </Router>
    </CustomBox>
  );
}

export default App;

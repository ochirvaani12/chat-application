import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { UserProvider } from './context/auth'
import './index.css'

// IMPORTING PAGES
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chats from './pages/Chats';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/chats' component={Chats} />
          <Route exact path='/chat/:conversationId?' component={Chat} />
          <Route exact path='/profile' component={Profile} />
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;

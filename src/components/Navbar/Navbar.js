import React from 'react';
// import PropTypes from 'prop-types';
import styles from './Navbar.module.css';
import {Navbar,Nav} from 'react-bootstrap';
import Login from '../Login/Login.js';
import logo from '../../logo.svg';
import Register from '../Register/Register.js';
import Profile from '../Profile/Profile.js';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import AuthService from '../../services/AuthService.js';

const token = AuthService.getToken();

class NavbarComponent extends React.Component {
  constructor(props){
    super(props);
    this.beforeAuth = this.beforeAuth.bind(this);
    this.afterAuth = this.afterAuth.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.state = {auth:false};
  }
  componentDidMount(){
    this.checkAuth();
  }
  checkAuth(){
    if(token) this.setState({auth:true});
    else this.setState({auth:false});
  }
  render(){
      if(this.state.auth) return this.afterAuth();
      else return this.beforeAuth();
  }
  beforeAuth(){
    return (
  <div className={styles.Navbar}>
    <Router>
      <Navbar bg="primary" variant="primary" expand="lg">
        <Navbar.Brand><img src={logo} width="30" height="30" alt="logo"/></Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} className="text-white" to="/">Register</Nav.Link>
          <Nav.Link as={Link} className="text-white" to="/login">Login</Nav.Link>
        </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/" component={Register}></Route>
      </div>
    </Router>
  </div>
    );
  }
  afterAuth(){
    return (
  <div className={styles.Navbar}>
    <Router>
      <Navbar bg="primary" variant="primary" expand="lg">
        <Navbar.Brand><img src={logo} width="30" height="30" alt="logo"/></Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} className="text-white" to="/profile">Profile</Nav.Link>
          <Nav.Link as={Link} className="text-white" to="/logout">Logout</Nav.Link>
        </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <Route exact path="/profile" component={Profile}></Route>
        <Route exact path="/logout" component={Logout}></Route>
      </div>
    </Router>
  </div>
    );
  }
}

// const NavbarComponent = () => {
// if(token){

// } else {

// }
// }

const Logout = (props) => {
  AuthService.removeToken();
  window.location.href = window.location.origin+'/login';
};

export default NavbarComponent;

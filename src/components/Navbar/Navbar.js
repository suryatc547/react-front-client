import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navbar.module.css';
import {Navbar,Nav} from 'react-bootstrap';
import Login from '../Login/Login.js';
import logo from '../../logo.svg';
import Register from '../Register/Register.js';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';

const NavbarComponent = () => (
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

Navbar.propTypes = {};

Navbar.defaultProps = {};

export default NavbarComponent;

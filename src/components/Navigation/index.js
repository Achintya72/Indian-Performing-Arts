import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md'

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

import { Nav, Navbar } from 'react-bootstrap';
import './style.css';
import styled from 'styled-components';


const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);
class NavigationAuthBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    const docRef = this.props.firebase.users().doc(`${this.props.authUser.uid}`);

    docRef.get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({ ...doc.data() })
        }
      })
  }
  render() {
    if (this.state.studentDetails != null) {
      var role = this.state.studentDetails.role;
    }
    else {
      var role = null;
    }
    return (
      <Styles>
        <Navbar expand="lg">
          <Navbar.Brand href={ROUTES.HOME}>Indian Performing Arts</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Item><Nav.Link href={ROUTES.HOME}>Home</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link href={ROUTES.EVENTS}>Events</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link href={ROUTES.ABOUT}>About Us</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link href={ROUTES.DASHBOARD}>Dashboard</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link href={ROUTES.ACCOUNT}>Account</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link href={ROUTES.ADMIN}>Admin</Nav.Link></Nav.Item>
              {/* <Nav.Item><Nav.Link href={ROUTES.HOME}><SignOutButton /></Nav.Link></Nav.Item> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Styles>
    )
  }

}
const Styles = styled.div`
  .navbar {
    background-color: #222;
  }

  .navbar-brand, .navbar-nav .nav-link {
    color: #bbb;

    &:hover {
      color:white;
    }
  }
`;
const NavigationAuth = withFirebase(NavigationAuthBase);
const NavigationNonAuth = () => (
  <Styles>
    <Navbar expand='lg'>
      <Navbar.Brand href={ROUTES.HOME}>Indian Performing Arts</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Item><Nav.Link className="nav-link" href={ROUTES.HOME}>Home</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href={ROUTES.EVENTS}>Events</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href={ROUTES.ABOUT}>About Us</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href={ROUTES.SIGN_IN}>Sign In</Nav.Link></Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </Styles>
  // <div className="nav">
  //   <div id="header"><p>Indian Performing Arts</p></div>
  //   <div>
  //     <Link className="Link" to={ROUTES.HOME}>Home</Link>
  //     <Link className="Link" to={ROUTES.EVENTS}>Events</Link>
  //     <Link className="Link" to={ROUTES.ABOUT}>About</Link>
  //     <Link className="Link" to={ROUTES.SIGN_IN}>Sign In</Link>
  //   </div>
  // </div>
);

export default Navigation;
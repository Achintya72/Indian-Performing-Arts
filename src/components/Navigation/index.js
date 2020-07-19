import React from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md'

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

import './style.css';


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
      <div className="nav">
        <Link className="Link" to={ROUTES.HOME}>Home</Link>
        <Link className="Link" to={ROUTES.EVENTS}> Events </Link>
        <Link className="Link" to={ROUTES.ABOUT}> About </Link>
        <Link className="Link" to={ROUTES.DASHBOARD}>Dashboard</Link>
        <Link className="account" to={ROUTES.ACCOUNT}>Account</Link>
        {role === 'a' || role === 'sa'
          ? <Link className="admin" to={ROUTES.ADMIN}> Admin </Link>
          : <span></span>}
        <span className="signOut">
          <SignOutButton />
        </span>
        <MdAccountCircle size={30} color='black' className="Account" />
      </div>
    )
  }

}
const NavigationAuth = withFirebase(NavigationAuthBase);
const NavigationNonAuth = () => (
  <div className="nav">
    <Link className="Link" to={ROUTES.HOME}>Home</Link>
    <Link className="Link" to={ROUTES.EVENTS}>Events</Link>
    <Link className="Link" to={ROUTES.ABOUT}>About</Link>
    <Link className="Link" to={ROUTES.SIGN_IN}>Sign In</Link>
  </div>
);

export default Navigation;
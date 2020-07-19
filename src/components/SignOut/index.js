import React from 'react';
 
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose} from 'recompose';

import * as ROUTES from '../../constants/routes';

class SignOutButtonBase extends React.Component {
  constructor(props) {
    super(props);

  }

  handleClick = () => {
    this.props.firebase.doSignOut();
    this.props.history.push(ROUTES.HOME);
  }
  render() {
    return(
      <span onClick={this.handleClick}> Sign Out </span>
    )
  }
}

const SignOutButton = compose(
  withRouter,
  withFirebase,
)(SignOutButtonBase);
 
export default withFirebase(SignOutButton);
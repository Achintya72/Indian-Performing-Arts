import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navigation from '../Navigation';
import HomePage from '../Home';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import DashBoardPage from '../Dashboard';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import EventPage from '../Events';
import AboutPage from '../About';
import { Layout } from './Layout';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <React.Fragment>
    <Navigation />
    <Layout>
      <Router>
        
        <Switch>
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.ABOUT} component={AboutPage} />
          <Route path={ROUTES.EVENTS} component={EventPage} />
          <Route
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route path={ROUTES.DASHBOARD} component={DashBoardPage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
        </Switch>
      </Router>
    </Layout>
  </React.Fragment>
);

export default withAuthentication(App);
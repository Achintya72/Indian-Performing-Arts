import React from 'react';
 
import { withAuthorization } from '../Session';
 
const DashBoaardPage = () => (
  <div>
    <h1>Dashboard</h1>
    <p>The Dashboard is accessible by every signed in user.</p>
  </div>
);
 
const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(DashBoaardPage);
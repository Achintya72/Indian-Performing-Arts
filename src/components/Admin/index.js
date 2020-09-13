import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import AdminUsersPage from './AdminUsers/AdminUsersPage';
import AdminDocumentsPage from './AdminDocumentsPage';
import EventPage from '../Events';
import { Nav, Container } from 'react-bootstrap';
import Loading from '../Session/Loading';
class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentPage: 'users'
    }
  }
  componentDidUpdate() {
    const { loading } = this.state;
    if (loading !== false) {
      if (this.props.firebase.auth.currentUser !== null) {
        this.props.firebase.users().where('email', '==', `${this.props.firebase.auth.currentUser.email}`)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.setState({ loading: false, ...doc.data() });
            })
          });
      }
      else {
        this.props.history.push(ROUTES.HOME);
      }
    }
  }
  render() {
    const { loading, currentPage } = this.state;
    return (
      <Container className="admin">
        <h1 className="header">Admin</h1>
        <Nav
          variant="pills"
          activeKey={currentPage}
          onSelect={(selectedKey) => this.setState({ currentPage: selectedKey })}
        >
          <Nav.Item>
            <Nav.Link eventKey="users">Users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="events">Events</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="documents">Manage Documents</Nav.Link>
          </Nav.Item>
        </Nav>
        <Loading loading={loading}>
          {currentPage === "users" ? <AdminUsersPage /> : <span></span>}
          {currentPage === "events" ? <EventPage admin={true} /> : <span></span>}
          {currentPage === "documents" ? <AdminDocumentsPage /> : <span></span>}
        </Loading>
      </Container>

    )
  }
}


export default withRouter(withFirebase(AdminPage));
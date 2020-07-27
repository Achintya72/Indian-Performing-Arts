import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import UserCard from './userCard';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }
  componentDidUpdate() {
    const { loading } = this.state;
    if(loading !== false) {
    this.props.firebase.users().where('email', '==', `${this.props.firebase.auth.currentUser.email}`)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({loading: false, ...doc.data() });
        })
      });
    }
  }
  render() {
    const { loading } = this.state;
    return (
      <div>
        {loading ? <h1> Loading ...</h1>:
        <div>
          {this.state.studentDetails.role == 'a' || this.state.studentDetails.role == 'sa' ?
          <AdminPageRight />
        : <AdminPageWrong />}  
        </div>}
      </div>
    )
  }
}

const AdminPageWrong = () => (
  <div>
    <h1> Oops </h1>
    <p>This page is only usable by admins. </p>
    <Link to={ROUTES.HOME}>Go back to Home Page</Link>
  </div>
)

class AdminPageRightBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users()
      .get()
      .then(querySnapshot => {
        const { users } = this.state;
        querySnapshot.forEach(doc => {
          users.push({
            id: doc.id,
            ...doc.data()
          });
        });
        this.setState({
          users: users,
          loading: false
        })
      })

  }

  render() {
    const { users, loading } = this.state;
    const userList = users.map(user => {
      return (
        <UserCard
          key={user.id}
          id={user.id}
          email={user.email}
          name={user.name}
          instruments={user.studentDetails.instruments}
          isStudent={user.studentDetails.isStudent}
          currentSong={user.studentDetails.song}
          beginningTimeH={user.studentDetails.classTime[0]}
          beginningTimeM={user.studentDetails.classTime[1]}
          endingTimeH={user.studentDetails.classTime[2]}
          endingTimeM={user.studentDetails.classTime[3]}
        />
      )
    })
    return (
      <div>
        {loading ? <h1>Loading...</h1> : userList}
      </div>
    )
  }
}
const AdminPageRight = compose(
  withRouter,
  withFirebase,
)(AdminPageRightBase);

export default withRouter(withFirebase(AdminPage));
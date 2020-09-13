import React, { Component } from 'react';
import Loading from '../../Session/Loading';
import { withFirebase } from "../../Firebase";
import { withRouter } from 'react-router-dom';
import UserCard from './userCard';
import '../styles.css'

class AdminUsersPage extends Component {
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
  handleRemove = (id) => {
    const {users} = this.state;
    this.props.firebase.documents().doc(`${id}`).delete()
    .then(() => {
      console.log('Done deleting' + id);
    })
    .catch(error => {
      console.error('error removing: ', id, error);
    })
    const user = users.find(user => user.id === id);
    const useri = users.indexOf(user);
    users.splice(useri, 1);
    this.setState({users: users});
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
          songs={user.studentDetails.songs}
          startTime={user.studentDetails.classTime[0].toDate()}
          endTime={user.studentDetails.classTime[0].toDate()}
          hasPaidYet={user.studentDetails.hasPaidYet}
          notes={user.studentDetails.notes}
          handleRemove={this.handleRemove}
        />
      )
    })
    return (
      <div className="users">
        <div>
          {userList}
        </div>
      </div>
    )
  }
}
export default withRouter(withFirebase(AdminUsersPage));
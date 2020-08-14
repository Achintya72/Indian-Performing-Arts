import React, {Component} from 'react';
import Loading from '../Session/Loading';
import { withFirebase } from "../Firebase";
import { withRouter } from 'react-router-dom';
import UserCard from './userCard';

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
          <Loading loading={loading}>{userList}</Loading>
        </div>
      )
    }
  }
export default withRouter(withFirebase(AdminUsersPage));
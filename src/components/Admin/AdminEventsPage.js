import React from 'react';

import { withFirebase } from '../Firebase';
import Loading from '../Session/Loading';

class AdminEventsPage extends React.Component {
    state={
        loading: false,
        events: []
    }
    componentDidMount() {
        this.setState({ loading: true });
    
        this.props.firebase.events()
          .get()
          .then(querySnapshot => {
            const { events } = this.state;
            querySnapshot.forEach(doc => {
              events.push({
                id: doc.id,
                ...doc.data()
              });
            });
            this.setState({
              events: events,
              loading: false
            })
          })
    
      }
      render() {
        const { events, loading } = this.state;
        const eventsList = events.map(user => {
          return (
            <EventCard
              key={user.id}
              id={user.id}
              name={user.name}
              description={user.description}
              dates={user.dates}
              other={user.other}
            />
          )
        })
        return (
          <div className="events">
            <h1 className="header">Events</h1>
            <Loading loading={loading}>{eventsList}</Loading>
          </div>
        )
      }
}
export default withFirebase(AdminEventsPage);
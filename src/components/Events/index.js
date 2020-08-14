import React, { Component } from 'react';

import './style.css'
import { withFirebase } from '../Firebase';
import EventCard from './EventCard';
import Loading from '../Session/Loading';
import { Button } from 'react-bootstrap';

class EventPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      events: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.events()
      .get()
      .then(querySnapshot => {
        const events = [];
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
  handleAdd = () => {
    this.setState({loading: true});
    this.props.firebase.events()
    .add({
      name: '',
      description: '',
      dates: [
        this.props.firebase.firebase.firestore.Timestamp.fromDate(new Date()),
        this.props.firebase.firebase.firestore.Timestamp.fromDate(new Date())
      ]
    })
    .catch(error => console.error(error));
    this.props.firebase.events()
      .get()
      .then(querySnapshot => {
        const events = [];
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
  handleRemove = (id) => {
    const {events} = this.state;
    this.props.firebase.events().doc(`${id}`).delete()
    .then(() => {
      console.log('Done deleting' + id);
    })
    .catch(error => {
      console.error('error removing: ', id);
    })
    const event = events.find(event => event.id === id);
    const eventi = events.indexOf(event);
    events.splice(eventi, 1);
    this.setState({events: events});
  }
  render() {
    const { events, loading } = this.state;
    const eventsList = events.map(event => {
      const EventProps = {
        key: event.id,
        id: event.id,
        name: event.name,
        description: event.description,
        dates: event.dates,
        admin: this.props.admin,
        editing: false,
        onRemove: this.handleRemove
      };
      if(event.location !== undefined) {
        EventProps.location = event.location;
      }
      if(event.image !== undefined) {
        EventProps.image = event.image;
      }
      if(event.url !== undefined) {
        EventProps.url = event.url;
      }
      return (
        <EventCard
          {...EventProps}
        />
      )
    })
    return (
      <div className="eventspage container">
        <h1 className="header">Events</h1>
        {this.props.admin? <Button variant="dark" onClick={this.handleAdd}>Add Event</Button>: ''}
        <div className="events">
          <Loading loading={loading}>
            {eventsList}
          </Loading>
        </div>
      </div>
    )
  }
}
EventPage.defaultProps = {
  admin: false
}
export default withFirebase(EventPage);
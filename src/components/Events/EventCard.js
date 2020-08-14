import React from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import './style.css';
import { withFirebase } from '../Firebase';

class EventCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            description: props.description,
            location: props.location,
            image: props.image,
            url: props.url,
            admin: props.admin,
            editing: props.editing,
            date1: props.dates[0].toDate(),
            date2: props.dates[1].toDate()
        }
        this.staticState = this.state;
    }
    edit = () => {
        this.setState({
            editing: true
        });
    }
    onCancel = () => {
        this.setState({
            ...this.staticState,
            editing: false
        });
    }
    onRemove = () => {
        var confirm = window.confirm("Are you sure you want to delete: \n " + this.state.name + '?');
        if (confirm) {
            this.props.onRemove(this.props.id);
        }
    }
    onSave = () => {
        const {
            name,
            description,
            location,
            image,
            url,
            date1,
            date2
        } = this.state;
        var objectToPush = {
            name: name,
            description: description,
            dates: [
                this.props.firebase.firebase.firestore.Timestamp.fromDate(date1),
                this.props.firebase.firebase.firestore.Timestamp.fromDate(date2)
            ]
        }
        if (location.Address !== '') {
            objectToPush.location = location;
        }
        if (image !== require('../Images/DefaultImg.PNG')) {
            objectToPush.image = image;
        }
        if (url !== '') {
            objectToPush.url = url;
        }
        this.staticState = this.state;
        this.setState({
            editing: false
        });
        this.props.firebase.events().doc(`${this.props.id}`)
            .set(objectToPush)
            .then(() => {
                console.log('DOne!');
            })
    }
    handleChange = (event) => {
        const { name, value } = event.target;
        const { location } = this.state;
        if (name === 'location.Address') {
            location.Address = value;
            this.setState({ location: location });
        }
        else if (name === 'location.gmap') {
            location.gmap = value;
            this.setState({ location: location });
        }
        else {
            this.setState({
                [name]: value
            });
        }
    }

    firstTime = (date) => {
        this.setState({ date1: date });
    }
    sTime = (date) => {
        this.setState({ date2: date });
    }
    render() {
        const {
            name,
            description,
            date1,
            date2,
            location,
            image,
            url,
            admin,
            editing
        } = this.state;
        const Months = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun",
            "Jul", "Aug", "Sept",
            "Oct", "Nov", "Dec"
        ];
        const withZero = (num) => {
            if (num < 10) {
                num = '0' + num;
            }
            return num;
        }
        var DateText = '';
        var TimeText = '';
        if (`${date1.getHours()} ${date1.getMinutes()}` !== `${date2.getHours()} ${date2.getMinutes()}`) {
            TimeText =
                `${withZero(date1.getHours())}:${withZero(date1.getMinutes())} - ` +
                `${withZero(date2.getHours())}:${withZero(date2.getMinutes())}`
        }
        if (`${date1.getMonth()} ${date1.getDate()} ${date1.getFullYear()}` === `${date2.getMonth()} ${date2.getDate()} ${date2.getFullYear()}`) {
            DateText =
                Months[date1.getMonth()] + ' ' +
                withZero(date1.getDate()) + ', ' +
                date1.getFullYear() + ' ' + TimeText;
        }
        else {
            DateText = Months[date1.getMonth()] + ' ' +
                withZero(date1.getDate()) + ' - ' +
                Months[date2.getMonth()] + " " +
                withZero(date2.getDate()) + ' ' + TimeText;
        }
        return (
            <>
                {editing ?
                    <Card>
                        <Card.Img src={image}></Card.Img>
                        <Card.Body>
                            <div className="form-group">
                                <label className="form-label" htmlFor='url'>Image Url:</label>
                                <input
                                    id="url"
                                    className="form-control"
                                    name="image"
                                    type="text"
                                    value={image}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor='name'>Event Name: </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor='des'>Description: </label>
                                <textarea
                                    className="form-control"
                                    id="des"
                                    name="description"
                                    onChange={this.handleChange}
                                    value={description}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor='st'>Starting Time:</label>
                                <DateTimePicker id="st" className="form-control" value={date1} onChange={this.firstTime} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor='et'>Ending Time:</label>
                                <DateTimePicker id="et" className="form-control" value={date2} onChange={this.sTime} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="locText">Location Address:</label>
                                <input
                                    name="location.Address"
                                    id="locText"
                                    className="form-control"
                                    value={location.Address}
                                    type="text"
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="locUrl">Location G-Map URL:</label>
                                <input
                                    name="location.gmap"
                                    id="locUrl"
                                    className="form-control"
                                    value={location.gmap}
                                    type="url"
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="deets">Url for More Information:</label>
                                <input
                                    name="url"
                                    className="form-control"
                                    id="deets"
                                    value={url}
                                    type="url"
                                    onChange={this.handleChange} />
                            </div>
                            <ButtonGroup>
                                <Button variant="primary" onClick={this.onCancel}>Cancel</Button>
                                <Button variant='primary' onClick={this.onSave}>Save</Button>
                                <Button variant="primary" onClick={this.onRemove}>Remove Event</Button>
                            </ButtonGroup>
                        </Card.Body>
                    </Card>
                    : <Card>
                        <Card.Img src={image}></Card.Img>
                        <Card.Body>
                            <Card.Title>{name}</Card.Title>
                            <Card.Text>{description}</Card.Text>
                            <Card.Text><Card.Link href={location.gmap}>{location.Address}</Card.Link></Card.Text>
                            <Card.Text>{DateText}</Card.Text>
                            <Card.Text>
                                <Button variant="outline-primary" href={url}>Learn More</Button>
                            </Card.Text>
                            {admin ?
                                <Button variant="primary" onClick={this.edit}>Edit</Button> : <span></span>}

                        </Card.Body>
                    </Card>


                }
            </>
        )
    }
}
EventCard.defaultProps = {
    location: {
        Address: '',
        gmap: ''
    },
    image: require('../Images/DefaultImg.PNG'),
    url: ''
};

export default withFirebase(EventCard);
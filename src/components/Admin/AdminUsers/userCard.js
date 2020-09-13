import React from 'react';
import { withFirebase } from '../../Firebase';
import { Card, Button, ListGroup, ButtonGroup, Form, Modal } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';

class UserCardBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            email: props.email,
            name: props.name,
            instruments: props.instruments,
            isStudent: props.isStudent.toString(),
            allSongs: [],
            songs: props.songs,
            startTime: props.startTime,
            endTime: props.endTime,
            hasPaidYet: props.hasPaidYet.toString(),
            notes: props.notes,
            editing: false,
            modal: false,
            searchTerm: ''
        }
        this.stateSnapshot = {
            id: props.id,
            email: props.email,
            name: props.name,
            instruments: props.instruments,
            allSongs: [],
            isStudent: props.isStudent.toString(),
            songs: props.songs,
            startTime: props.startTime,
            endTime: props.endTime,
            editing: false,
            hasPaidYet: props.hasPaidYet.toString(),
            notes: props.notes,
            modal: false,
            searchTerm: ''
        };
    }
    componentDidMount() {
        this.props.firebase.documents().get()
            .then(querySnapshot => {
                const { allSongs } = this.state;
                querySnapshot.forEach(data => {
                    allSongs.push({
                        id: data.id,
                        ...data.data()
                    })
                })
                this.setState({
                    allSongs
                });
            })
    }

    /*this can only handle string changes
     * if the value of the state element is boolean it will not work
    */
    handleChange = (event) => {
        const { instruments } = this.state;
        const { type, value, checked } = event.target;
        if (type === 'checkbox') {
            if (checked === true) {
                instruments.push(value);
            }
            else {
                instruments.splice(instruments.indexOf(value), 1);
            }
            this.setState({
                instruments: instruments
            })
        }
        else {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    }
    cancelClick = (e) => {
        e.preventDefault();
        const newState = this.stateSnapshot;
        newState.editing = false;
        this.setState({
            ...newState,
        });
    }
    saveClick = (e) => {
        e.preventDefault();
        const newState = this.state;
        this.setState({
            editing: false
        });
        newState.editing = false;
        this.stateSnapshot = newState;
        this.props.firebase.users().doc(`${this.stateSnapshot.id}`).set({
            studentDetails: {
                isStudent: (this.stateSnapshot.isStudent === 'true'),
                songs: this.stateSnapshot.songs,
                classTime: [
                    this.props.firebase.firebase.firestore.Timestamp.fromDate(this.stateSnapshot.startTime),
                    this.props.firebase.firebase.firestore.Timestamp.fromDate(this.stateSnapshot.endTime)
                ],
                notes: this.stateSnapshot.notes,
                hasPaidYet: (this.stateSnapshot.hasPaidYet === 'true')
            }
        }, { merge: true });

    }
    editClick = () => {
        this.setState({
            editing: true
        });
    }
    startTimeChangeHandler = (date) => {
        this.setState({ startTime: date });
    }
    endTimeChangeHandler = (date) => {
        this.setState({ endTime: date });
    }
    handleSongChange = (event) => {
        const { value, checked } = event.target;
        const { songs } = this.state;
        if (checked === false) {
            const index = songs.indexOf(value);
            songs.splice(index, 1);
        }
        else {
            songs.push(value);
        }
        this.setState({ songs });
    }
    songCancel = () => {
        const { songs } = this.stateSnapshot;
        this.setState({
            songs: songs,
            modal: false
        });
    }
    songSave = () => {
        this.setState({ modal: false });
    }
    render() {
        const {
            id,
            allSongs,
            searchTerm,
            email,
            name,
            instruments,
            isStudent,
            songs,
            startTime,
            endTime,
            editing,
            modal,
            notes,
            hasPaidYet
        } = this.state;
        const InstrumentText = instruments !== [] ? instruments.join(' ') : 'No Instruments';
        const withZero = (num) => {
            if (num < 10) {
                num += '0';
            }
            return num
        }
        var checkBoxes = allSongs.map(song => {
            if (searchTerm.length !== 0 && song.name.indexOf(searchTerm) > -1) {
                return (
                    <Form.Check
                        key={song.id}
                        name='songs'
                        value={song.name}
                        label={song.name}
                        type="checkbox"
                        checked={songs.includes(song.name)}
                        onChange={this.handleSongChange}
                    />
                )
            }
            else if (searchTerm.length === 0) {
                return (
                    <Form.Check
                        key={song.id}
                        name='songs'
                        value={song.name}
                        label={song.name}
                        type="checkbox"
                        checked={songs.includes(song.name)}
                        onChange={this.handleSongChange}
                    />
                )
            }
        })
        const DateText = `${withZero(startTime.getHours())}:${withZero(startTime.getMinutes())} - ${withZero(endTime.getHours())}:${withZero(endTime.getMinutes())}`;
        return (
            <div className="documents">
                {editing ?
                    <Card>
                        <Card.Body>
                            <Card.Title>{name}</Card.Title>
                            <Card.Text><strong>E-Mail:</strong> {email}</Card.Text>
                            <Form>
                                <Form.Group>
                                    <Form.Label><strong>Student Status: </strong></Form.Label>
                                    <Form.Check
                                        name='isStudent'
                                        type="radio"
                                        label="Is a Student"
                                        value='true'
                                        checked={isStudent === 'true'}
                                        onChange={this.handleChange}

                                    />
                                    <Form.Check
                                        name="isStudent"
                                        type="radio"
                                        label="Is not a Student"
                                        value='false'
                                        checked={isStudent === 'false'}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Has Paid Yet:</strong></Form.Label>
                                    <Form.Check
                                        name="hasPaidYet"
                                        type="radio"
                                        label="Yes"
                                        value="true"
                                        checked={hasPaidYet === 'true'}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Check
                                        name="hasPaidYet"
                                        type="radio"
                                        label="No"
                                        value="false"
                                        checked={hasPaidYet === "false"}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Instruments: </strong></Form.Label>
                                    <Form.Check
                                        name="instruments"
                                        type="checkbox"
                                        label="Flute"
                                        value="Flute"
                                        checked={instruments.includes('Flute')}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Check
                                        name="instruments"
                                        type="checkbox"
                                        label="Tabla"
                                        value="Tabla"
                                        checked={instruments.includes("Tabla")}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Class Time:</strong></Form.Label>
                                    <Form.Text>Start Time:</Form.Text>
                                    <DateTimePicker value={startTime} className="form-control" onChange={this.startTimeChangeHandler} />
                                    <Form.Text>End Time: </Form.Text>
                                    <DateTimePicker value={endTime} className="form-control" onChange={this.endTimeChangeHandler} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Songs:</strong></Form.Label>
                                    <Card.Text>
                                        <Button onClick={() => this.setState({ modal: true })} variant='outline-secondary'>Edit Songs</Button>
                                    </Card.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Additional Notes:</strong></Form.Label>
                                    <Form.Control
                                        name="notes"
                                        as="textarea"
                                        rows={5}
                                        value={notes}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <ButtonGroup>
                                    <Button variant="primary" onClick={this.saveClick}> Save </Button>
                                    <Button variant="secondary" onClick={this.cancelClick}> Cancel </Button>
                                    <Button variant="warning" onClick={() => this.props.handleRemove(id)}>Remove User</Button>
                                </ButtonGroup>
                            </Form>
                            <Modal show={modal} onHide={() => this.songCancel}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Manage Songs</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group>
                                        <Form.Label>Search for Song:</Form.Label>
                                        <Form.Control
                                            name="searchTerm"
                                            value={searchTerm}
                                            onChange={this.handleChange}
                                        />

                                    </Form.Group>
                                    {checkBoxes}
                                    <ButtonGroup>
                                        <Button variant="primary" onClick={this.songCancel}>Cancel</Button>
                                        <Button variant="secondary" onClick={this.songSave}>Save</Button>
                                    </ButtonGroup>
                                </Modal.Body>
                            </Modal>
                        </Card.Body>
                    </Card>
                    :
                    <Card>
                        <Card.Body>
                            <Card.Title>{name}</Card.Title>
                            <Card.Text><strong>E-Mail:</strong> {email}</Card.Text>
                            <Card.Text><strong>Status: </strong>{isStudent ? 'Is A Student' : 'Not a Student Yet'}</Card.Text>
                            <Card.Text><strong>Has Paid Yet:</strong> {hasPaidYet === 'true' ? 'Yes' : 'No'}</Card.Text>
                            <Card.Text><strong>Instruments: </strong> {InstrumentText}</Card.Text>
                            <Card.Text><strong>Class Time:</strong> {DateText}</Card.Text>
                            <Card.Text><strong>Songs:</strong></Card.Text>
                            <ListGroup variant="flush">
                                {songs.map(song => <ListGroup.Item key={song}><Card.Text>{song}</Card.Text></ListGroup.Item>)}
                            </ListGroup>
                            <Card.Text><strong>Additional Notes:</strong></Card.Text>
                            <Card.Text>{notes}</Card.Text>
                            <ButtonGroup vertical>
                                <Button variant="primary" onClick={() => this.props.handleRemove(id)}>Remove User</Button>
                                <Button onClick={this.editClick} variant="secondary">Edit Details</Button>
                            </ButtonGroup>
                        </Card.Body>
                    </Card>}
            </div>
        )
    }

}
const UserCard = withFirebase(UserCardBase);
export default UserCard;
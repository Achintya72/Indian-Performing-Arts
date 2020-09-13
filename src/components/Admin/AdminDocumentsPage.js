import React from 'react';
import { withFirebase } from '../Firebase';
import { Button, Card, Modal, ButtonGroup, Container, Form } from 'react-bootstrap';

import Loading from '../Session/Loading';
import './styles.css';

class AdminDocumentsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //List Containing All Songs :
            songsList: [],
            //List Containing Song Currently Being Uploaded by Admin:
            uploadSong: {
                name: '',
                // First will contain file, after this.handleUpload, it will contain download url
                pdf: null,
                audio: null
            },
            // Loading for all content
            loading: false,
            // Variable in charge for seeing if admin is adding a new file or not. (Toggling Modal)
            uploading: false,
            // Variable to inform component to upload urls to firestore and songsList
            uploaded: 2
        }
    }
    handleChange = (e) => {
        const { uploadSong } = this.state;
        if (e.target.name === 'name') {
            uploadSong.name = e.target.value;
        }
        if (e.target.name === 'pdf') {
            if (e.target.files[0]) {
                uploadSong.pdf = e.target.files[0];
            }
        }
        if (e.target.name === 'audio') {
            if (e.target.files[0]) {
                uploadSong.audio = e.target.files[0];
            }
        }
        this.setState({
            uploadSong: uploadSong
        });
    }
    handleUpload = () => {
        var { uploadSong, uploaded } = this.state;
        if (uploadSong.pdf !== null) {
            const uploadTask = this.props.firebase.storage.ref(`files/${uploadSong.pdf.name}`).put(uploadSong.pdf);
            uploadTask.on('state_changed',
                (snapshot) => {
                },
                (error) => { console.log(error) },
                () => {
                    this.props.firebase.storage.ref('files').child(uploadSong.pdf.name).getDownloadURL().then(url => {
                        uploadSong.pdf = url;
                        uploaded -= 1;
                        this.setState({
                            uploaded: uploaded,
                            uploadSong: uploadSong
                        });
                    })
                })
        } else {
            uploaded -= 1;
        }
        if (uploadSong.audio !== null) {
            const uploadTask2 = this.props.firebase.storage.ref(`files/${uploadSong.audio.name}`).put(uploadSong.audio);
            uploadTask2.on('state_changed',
                (snapshot) => {
                },
                (error) => { console.log(error) },
                () => {
                    this.props.firebase.storage.ref('files').child(uploadSong.audio.name).getDownloadURL().then(url => {
                        uploadSong.audio = url;
                        uploaded -= 1;
                        this.setState({
                            uploaded: uploaded,
                            uploadSong: uploadSong
                        });
                    })
                })
        } else {
            uploaded -= 1;
        }

    }
    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.documents().get()
            .then(querySnapshot => {
                const { songsList } = this.state;
                querySnapshot.forEach(song => {
                    songsList.push({
                        id: song.id,
                        ...song.data()
                    })
                });
                this.setState({
                    songsList: songsList,
                    loading: false
                })
            })
    }
    componentDidUpdate() {
        const { uploaded } = this.state;
        if (uploaded === 0) {
            this.firestorePush();
        }
    }
    firestorePush = () => {
        var { uploadSong, songsList } = this.state;
        console.log(uploadSong);
        this.props.firebase.documents().doc(`${uploadSong.name}`).set({
            ...uploadSong
        });
        songsList.push({ id: uploadSong.name, name: uploadSong.name, audio: uploadSong.audio, pdf: uploadSong.pdf });
        uploadSong = {
            name: '',
            audio: null,
            pdf: null
        };
        this.setState({
            uploading: false,
            uploaded: 2,
            songsList: songsList,
            uploadSong: uploadSong
        });

    }
    handleDelete = (song) => {
        const { songsList } = this.state;
        if (song.audio !== null) {
            this.props.firebase.storage.refFromURL(song.audio).delete();
        }
        if (song.pdf !== null) {
            this.props.firebase.storage.refFromURL(song.pdf).delete();
        }
        this.props.firebase.documents().doc(`${song.name}`).delete()
        const deletedSong = songsList.find(song1 => song1.name === song.name);
        const songI = songsList.indexOf(deletedSong);
        songsList.splice(songI, 1);
        this.setState({ songsList: songsList });
    }
    render() {
        const { songsList, loading, uploading, uploadSong } = this.state;
        const renderSongs = songsList.map(song => {
            return (
                <Card>
                    <Card.Body>
                        <Card.Title>{song.name}</Card.Title>
                        <ButtonGroup vertical>
                            {song.pdf !== null ? <Button variant="primary" href={song.pdf}>Open PDF:</Button> : 'No PDF'}
                            {song.audio !== null ? <Button href={song.audio}>Open Audio</Button> : 'No Audio'}
                            <Button variant="primary" onClick={() => this.handleDelete(song)}>Delete Song</Button>
                        </ButtonGroup>
                    </Card.Body>
                </Card>
            )
        })
        return (
            <Container className="documents">
                <h2 className="header">Manage Documents</h2>
                <Button variant="dark" onClick={() => this.setState({ uploading: true })}>Add New Song</Button>
                <Loading loading={loading}>
                    <div className="events">
                        {renderSongs}
                    </div>
                </Loading>
                <Modal show={uploading} onHide={() => this.setState({ uploading: false })}>
                    <Modal.Header>
                        <Modal.Title>Add New Song</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Name of Song: </Form.Label>
                                <Form.Control
                                    name="name"
                                    value={uploadSong.name}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.File
                                    name="pdf"
                                    onChange={this.handleChange}
                                    label="PDF"
                                    custom
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.File 
                                    name='audio'
                                    onChange={this.handleChange}
                                    label="MP3"
                                    custom
                                />
                            </Form.Group>
                            <ButtonGroup>
                                <Button variant="dark" onClick={this.handleUpload}> Upload Files</Button>
                                <Button variant="secondary" onClick={() => this.setState({ uploading: false })}>Cancel</Button>
                            </ButtonGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        )
    }
}
export default withFirebase(AdminDocumentsPage);
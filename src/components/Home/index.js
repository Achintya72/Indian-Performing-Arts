import React from 'react';
import { Jumbotron, Button, Card } from 'react-bootstrap';
import { Layout } from '../App/Layout';
import './styles.css'
const HomePage = () => (
    <div className="home">
        <Jumbotron>
            <img src={require('../Images/Jumbo2.jpg')} alt="Performance" style={{ width: '100%' }} />
            <div className="centered">
                <h1>Tabla and Bansuri</h1>
                <Button variant="dark" href="https://www.google.com">Watch Performances</Button>
            </div>
        </Jumbotron>

        <Layout>
            <h1 className="header">Instruments</h1>
            <div className="Instruments">
                <Card>
                    <Card.Img variant="top" src={require("../Images/Flute.jpg")} />
                    <Card.Body>
                        <Card.Title> Flute </Card.Title>
                        <Card.Text>
                            Learn concepts like Ragaas, Rhythm, and Melody on this beautiful instrument
                        </Card.Text>
                        <Button variant="outline-primary">Student Performances</Button>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src={require("../Images/Tabla.jpg")} />
                    <Card.Body>
                        <Card.Title> Tabla </Card.Title>
                        <Card.Text>
                            This double-drum instrument is incredible important to mantaining rhythm and can get quite wild when you play it fast
                        </Card.Text>
                        <Button variant="outline-primary">Student Performances</Button>
                    </Card.Body>
                </Card>
            </div>
            <h1 className="header">Words from Students</h1>
            <div className="Testimonials">
                <Card>
                    <Card.Body>
                        <blockquote className="blockquote mb-0">
                            <p>
                                I feel so happy when I play the flute.
                                Not only have these classes helped me connect to my origins more,
                                they have given me a community of music lovers.
                            </p>
                        </blockquote>
                        <footer className="blockquote-footer">
                            Achintya Agrawal <cite title="instrumentdeets">Learning Bansuri since 2019</cite>
                        </footer>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <blockquote className="blockquote mb-0">
                            <p>
                                These classses expand my knowledge about music everyday,
                                and I feel proud of myself and happy to play the Tabla.
                            </p>
                        </blockquote>
                        <footer className="blockquote-footer">
                            Pranav Kannepalli <cite title="instrumentdeets">Learning Tabla since 2017</cite>
                        </footer>
                    </Card.Body>
                </Card>
            </div>
        </Layout>
    </div>
)

export default HomePage;
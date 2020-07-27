import React from 'react';
import { Jumbotron, Button, Card } from 'react-bootstrap';
import { Layout } from '../App/Layout';
import './styles.css'
const HomePage = () => (
    <div className="contain">
        <Jumbotron>
            <img src={require('../Images/back.jpg')} alt="Performance" style={{ width: '100%' }} />
            <div className="centered">
                <h1>Tabla and Bansuri</h1>
                <Button variant="dark" href="https://www.google.com">Watch Performances</Button>
            </div>
        </Jumbotron>

        <Layout>
            <h1 className="header"> Instruments</h1>
            <div className="Instruments">
                <Card>
                    <Card.Img variant="top" src={require("../Images/Home1.jpg")} />
                    <Card.Body>
                        <Card.Title> Flute </Card.Title>
                        <Card.Text>
                            Learn concepts like Ragaas, Rhythm, and Melody on this beautiful instrument
                        </Card.Text>
                        <Button variant="outline-primary">Student Performances</Button>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src={require("../Images/Home.jpg")} />
                    <Card.Body>
                        <Card.Title> Tabla </Card.Title>
                        <Card.Text>
                            This double-drum instrument is incredible important to mantaining rhythm and can get quite wild when you play it fast
                        </Card.Text>
                        <Button variant="outline-primary">Student Performances</Button>
                    </Card.Body>
                </Card>
            </div>

            <div className="Testimonials">
                <h2>Words from Students</h2>
                <div id='1'>
                    <p> "I love it"</p>
                    <p> ~ Achintya Agrawal, 13 </p>
                </div>
                <div id="2">
                    <p> Can't stop playing</p>
                    <p> ~ Pranav Kannepalli, 13 </p>
                </div>
            </div>
        </Layout>
    </div>
)

export default HomePage;
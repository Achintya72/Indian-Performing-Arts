import React from 'react';
import './style.css';

const HomePage = () => (
    <div>
        <div className="homePic">
            {/* <img src={require('../Images/Home.jpg')} alt="" /> */}
            <div className="textUnder">
                <h1> Indian Performing Arts </h1>
                <p> Flute and Tabla</p> 
            </div>
        </div>

        <div className="Instruments">
            <h1> Instruments</h1>
            <div className="flute">
                <h2> Flute </h2>
                <p> Learn concepts like Ragaas, Rhythm, and Melody on this beautiful instrument</p>
            </div>
            <div className="tabla">
                <h2> Tabla </h2>
                <p> This double-drum instrument is incredible important to mantaining rhythm and can get quite wild when you play it fast</p>
            </div>
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
    </div>
)

export default HomePage;
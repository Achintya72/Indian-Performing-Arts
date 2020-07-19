import React from 'react';
import { withFirebase } from '../Firebase';

class UserCardBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            email: props.email,
            name: props.name,
            instruments: props.instruments,
            isStudent: props.isStudent,
            currentSong: props.currentSong,
            beginningTimeH: props.beginningTimeH,
            beginningTimeM: props.beginningTimeM,
            endingTimeH: props.endingTimeH,
            endingTimeM: props.endingTimeM,
            editing: false
        }
        this.stateSnapshot = {
            id: props.id,
            email: props.email,
            name: props.name,
            instruments: props.instruments,
            isStudent: props.isStudent,
            currentSong: props.currentSong,
            beginningTimeH: props.beginningTimeH,
            beginningTimeM: props.beginningTimeM,
            endingTimeH: props.endingTimeH,
            endingTimeM: props.endingTimeM,
            editing: false
        };
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
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
        this.stateSnapshot = newState;
        this.props.firebase.users().doc(`${this.stateSnapshot.id}`).set({
            studentDetails: {
                isStudent: this.stateSnapshot.isStudent,
                song: this.stateSnapshot.currentSong,
                classTime: [parseInt(this.stateSnapshot.beginningTimeH), 
                    parseInt(this.stateSnapshot.beginningTimeM), 
                    parseInt(this.stateSnapshot.endingTimeH), 
                    parseInt(this.stateSnapshot.endingTimeM)]
            }
        }, {merge: true});
    }
    editClick = () => {
        this.setState({
            editing: true
        });
    }
    render() {
        const {
            email,
            name,
            instruments,
            isStudent,
            currentSong,
            beginningTimeH,
            beginningTimeM,
            endingTimeH,
            endingTimeM,
            editing } = this.state;
        return (
            <div>
                {
                    editing ?
                        <div>
                            <form>
                                <h3><strong>Name: </strong> {name}</h3>
                                <br />
                                <p><strong>Email: </strong> {email}</p>
                                <br />
                                <p><strong>Instrument(s): </strong>{instruments}</p> <br />
                                <p><strong>Registered as Student? </strong></p>
                                <input
                                    type="radio"
                                    name="isStudent"
                                    value={true}
                                    checked={isStudent}
                                    onClick={this.handleChange} /> Yes
                                <input
                                    type="radio"
                                    name="isStudent"
                                    value={false}
                                    checked={!isStudent}
                                    onClick={this.handleChange} /> No
                                <br />
                                {isStudent ?
                                    <div>
                                        <p><strong>Current Song: </strong></p>
                                        <input
                                            name="currentSong"
                                            type="text"
                                            value={currentSong}
                                            onChange={this.handleChange} />
                                        <br />
                                        <p><strong>Class Time: </strong></p>
                                        <p></p>
                                        <input
                                            name="beginningTimeH"
                                            type="number"
                                            value={beginningTimeH}
                                            onChange={this.handleChange}
                                            max={17}
                                            min={8}
                                        /> :
                                        <input
                                            name="beginningTimeM"
                                            type="number"
                                            value={beginningTimeM}
                                            onChange={this.handleChange}
                                            max={59}
                                            min={0}
                                        /> -
                                        <input
                                            name="endingTimeH"
                                            type="number"
                                            value={endingTimeH}
                                            onChange={this.handleChange}
                                            max={17}
                                            min={8}
                                        /> :
                                        <input
                                            name="endingTimeM"
                                            type="number"
                                            value={endingTimeM}
                                            onChange={this.handleChange}
                                            max={59}
                                            min={0}
                                        />
                                    </div>

                                    : <div></div>}
                                <button name="cancel" onClick={this.cancelClick}> Cancel</button>
                                <button name="save" onClick={this.saveClick}> Save </button>

                            </form>
                        </div> :
                        <div>
                            <h3><strong>Name: </strong> {name} </h3> <br />
                            <p><strong>Email: </strong> {email} </p> <br />
                            <p><strong>Instruments: </strong> {instruments.map(instrument => `${instrument} `)} </p> <br />
                            <p><strong>Registered as Student? </strong> {isStudent ? 'Yes' : 'No'}</p> <br />
                            {isStudent ?
                                <div>
                                    <p><strong> Current Song: </strong> {currentSong} </p> <br />
                                    <p><strong>Class Time: </strong> {beginningTimeH}:{beginningTimeM}-{endingTimeH}:{endingTimeM}</p>

                                </div>
                                :
                                <div></div>
                            }
                            <button name="edit" onClick={this.editClick}> Edit </button>
                        </div>}
            </div>
        )
    }

}
const UserCard = withFirebase(UserCardBase);
export default UserCard;
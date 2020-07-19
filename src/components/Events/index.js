import React, {Component} from 'react';

import { withFirebase } from '../Firebase';

class EventPageBase extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1> Events </h1>
            </div>
        )
    }
}

const EventPage = withFirebase(EventPageBase);
export default EventPage;
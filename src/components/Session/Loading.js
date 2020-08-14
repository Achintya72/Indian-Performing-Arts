import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function Loading(props) {
    return (
        <>
            {props.loading ?
                <div className="spincontainer">
                    <Spinner
                        animation="border"
                        role="status"><span className="sr-only">Loading...</span>
                    </Spinner>

                </div>
                : props.children
            }
        </>
    )
}
export default Loading;
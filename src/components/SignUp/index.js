import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';


import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    flute: false,
    tabla: false,
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, email, passwordOne, flute, tabla } = this.state;

        var instruments = [];
        
        if(flute === true) {
            instruments.push('flute');
        }
        if(tabla === true) {
            instruments.push('tabla');
        }
     
        this.props.firebase
          .doCreateUserWithEmailAndPassword(email, passwordOne)
          .then(authUser => {
            // Create a user in your Firebase realtime database
            return this.props.firebase
              .users()
              .doc(`${authUser.user.uid}`)
              .set({
                  name: username,
                  email: email,
                  studentDetails: {
                      role: 'ns',
                      instruments: instruments,
                      song: '',
                      isStudent: false,
                      classTime: [0,0, 0,0]
                  }
              });
            // console.log(this.props.firebase.db.ref('users/'+ authUser.user.uid));
          })
          .then(authUser => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.DASHBOARD);
          })
          .catch(error => {
            this.setState({ error });
          });
     
        event.preventDefault();
      };

    onChange = event => {
        const {name, value, type, checked} = event.target;

        type === "checkbox" ? this.setState({ [name] : checked }) : this.setState({ [name] : value});
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            flute,
            tabla,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />

                <br />

                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />

                <br /> 

                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />

                <br />

                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />

                <br /> 

                <input 
                    type="checkbox"
                    name="flute"
                    checked={flute}
                    onChange={this.onChange}
                /> Flute

                <br />

                <input
                    type="checkbox"
                    name="tabla"
                    checked={tabla}
                    onChange={this.onChange}
                /> Tabla

                <br />

                <button disabled={isInvalid} type="submit">Sign Up</button>

                {error && <p>{error.message}</p>}
        </form>
    );
  }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink};
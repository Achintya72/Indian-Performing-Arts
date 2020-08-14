import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';


const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
    constructor() {
        this.app = app.initializeApp(config);
        this.firebase = firebase;
        this.auth = this.app.auth();
        this.db = this.app.firestore();
        this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }


    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) => 
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    users = () => this.db.collection('users');

    getUserData = () => this.users().where('email', '==', `${this.auth.currentUser}`);
    
    events = () => this.db.collection('events');
}

export default Firebase;
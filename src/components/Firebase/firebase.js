// firebase.js - Firebase
// Establishes the Firebase configuration (app), Firebase auth functionality, Firebase database
import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// the constant value when the environment == 'production'
const prodConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  googleFirebaseApiKey: process.env.REACT_APP_GOOGLE_FIREBASE_API_KEY,
  googleProjectName: process.env.REACT_APP_GOOGLE_PROJECT_NAME,
  googleWebClientId: process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID,
  googleWebClientSecret: process.env.REACT_APP_GOOGLE_WEB_CLIENT_SECRET,
  facebookLoginAppId: process.env.REACT_APP_FACEBOOK_LOGIN_APP_ID,
  facebookLoginApiSecret: process.env.REACT_APP_FACEBOOK_LOGIN_API_SECRET,
  twitterLoginApiKey: process.env.REACT_APP_TWITTER_LOGIN_API_KEY,
  twitterLoginApiSecret: process.env.REACT_APP_TWITTER_LOGIN_API_SECRET
}

// the constant value when the environment !== 'production'
const devConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  googleFirebaseApiKey: process.env.REACT_APP_GOOGLE_FIREBASE_API_KEY,
  googleProjectName: process.env.REACT_APP_GOOGLE_PROJECT_NAME,
  googleWebClientId: process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID,
  googleWebClientSecret: process.env.REACT_APP_GOOGLE_WEB_CLIENT_SECRET,
  facebookLoginAppId: process.env.REACT_APP_FACEBOOK_LOGIN_APP_ID,
  facebookLoginApiSecret: process.env.REACT_APP_FACEBOOK_LOGIN_API_SECRET,
  twitterLoginApiKey: process.env.REACT_APP_TWITTER_LOGIN_API_KEY,
  twitterLoginApiSecret: process.env.REACT_APP_TWITTER_LOGIN_API_SECRET
}

// set the config constant to the appropriate value
const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

class Firebase {
  constructor() {
    // initialize the app using the Firebase config to instatiate all of the firebase services
    app.initializeApp(config)

    // instantiate the initial auth state within the app
    this.auth = app.auth()  // Gets the Auth service for the current app

    // instantiate the database within the app
    this.db = app.database()  // Gets the Database service for the current app

    // Social media login providers (authorization methods within Firebase)
    this.facebookProvider = new app.auth.FacebookAuthProvider()
    this.googleProvider = new app.auth.GoogleAuthProvider()
    this.twitterProvider = new app.auth.TwitterAuthProvider()
  }

  // ***** Firebase Auth API *****
  // create user with email and password (equate doCreate... with Firebase createUser...)
  doCreateUserWithEmailAndPassword = ( email, password ) => this.auth.createUserWithEmailAndPassword( email, password )
  // ***** SignIn with email ***** (equate doSignIn... with Firebase signIn...)
  doSignInWithEmailAndPassword = ( email, password ) => this.auth.signInWithEmailAndPassword( email, password )
  // ***** SignIn with facebook ***** (equate as above)
  doSignInWithFacebook = () => this.auth.signInWithPopup( this.facebookProvider )
  // ***** SignIn with google ***** (equate as above)
  doSignInWithGoogle = () => this.auth.signInWithPopup( this.googleProvider )
  // ***** SignIn with twitter ***** (equate as above)
  doSignInWithTwitter = () => this.auth.signInWithPopup( this.twitterProvider )
  // ***** SignOut ***** (equate as above)
  doSignOut = () => this.auth.signOut()
  // ***** Password Reset ***** (equate as above)
  doPasswordReset = email => this.auth.sendPasswordResetEmail( email )
  // ***** Password Update ***** (equate as above)
  doPasswordUpdate = password => this.auth.currentUser.updatePassword( password )

  // ***** Merge Auth and DB User API *****

  // ***** NOTES TO SELF *****
  // Authorized users are NOT a part of the underlying database but are managed behind the scene in Firebase's auth module.
  // Each authUser equates to a user with permissions in the application.
  // Each authUser has a FIXED SET of basic properties -- uid (assigned by firebase) & primary email, name, photo URL (managed by the user).
  // Firebase has an official means of introducing roles into authUsers, however it relies heavily on Firebase internals
  // and creates a sort of vendor lock in situation, making migration to other technologies more difficult.
  // In order to manage other properties (eg. roles and permissions) they must be merged into the underlying database deliberately.
  // That is the purpose of this method -- it differentiates authUser and dbUser
  // It fires at startup and any time the state of the authUser changes and executes the following:
  //    1. test for the change of state in the Auth object (onAuthStateChanged) returning authUser (undefined if not logged in)
  //    2. if authUser ( an authUser is signed in )
  //    3. set dbUser uid to authUser uid
  //    4. use the 'value' event once to retrieve the data
  //    5. get a snapshot and extract the data (.val()) from the snapshot
  //    6. merge the data and set it (write it)
  // Reference  --  authUser: https://firebase.google.com/docs/reference/node/firebase.User.html. 
  //                dbUser: https://firebase.google.com/docs/reference/node/firebase.database
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {  
      if ( authUser ) {                         
        this.user(authUser.uid)                 
          .once('value')                        
          .then(snapshot => {                          
            const dbUser = snapshot.val()
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              ...dbUser,
            }
            next(authUser)
          })
      } else {                                  //  there is no authUser
        fallback()
      }
    })

  // ***** User API ***** 
  // set the current user id
  user = uid => this.db.ref(`users/${uid}`)
  // set the reference to the users collection in the firebase database
  users = () => this.db.ref('users')
}

export default Firebase

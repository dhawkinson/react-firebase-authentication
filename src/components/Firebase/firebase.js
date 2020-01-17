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
    // initialize the app with the Firebase config
    app.initializeApp(config)

    // set the initial auth state
    this.auth = app.auth()

    // identify the database
    this.db = app.database()

    // Social media login providers
    this.googleProvider = new app.auth.GoogleAuthProvider()
    this.facebookProvider = new app.auth.FacebookAuthProvider()
    this.twitterProvider = new app.auth.TwitterAuthProvider()
  }

  // ***** Auth API ***** (use the offical Firebase endpoint)
  // create  user with email and password
  doCreateUserWithEmailAndPassword = ( email, password ) => this.auth.createUserWithEmailAndPassword( email, password )

  // ***** SignIn with email *****
  doSignInWithEmailAndPassword = ( email, password ) => this.auth.SignInWithEmailAndPassword( email, password )

  // ***** SignIn with google *****
  doSignInWithGoogle = () => this.auth.SignInWithPopup( this.googleProvider )

  // ***** SignIn with facebook *****
  doSignInWithFacebook = () => this.auth.SignInWithPopup( this.facebookProvider )

  // ***** SignIn with twitter *****
  doSignInWithTwitter = () => this.auth.SignInWithPopup( this.twitterProvider )

  // ***** SignOut *****
  doSignOut = () => this.auth.signOut()

  // ***** Password Reset *****
  doPasswordReset = email => this.auth.sendPasswordResetEmail( email )

  // ***** Password Update *****
  doPasswordUpdate = password => this.auth.currentUser.updatePassword( password )

  // ***** Merge Auth and DB User API *****
  // by default, authorized users are NOT a part of the undelying database
  // authorized users are managed behind the scene in Firebases auth module
  // in order to make the generally available in the database they must be merged into the database deliberately
  // that is the purpose of this functionality
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if ( authUser ) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val()
            
            // default empty roles
            if ( !dbUser.roles ) {
              dbUser.roles = {}
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            }
            next(authUser)
          })
      } else {
        fallback()
      }
    })

  // ***** User API ***** 
  // set the current user id
  user = uid => this.db.ref(`users/${uid}`)
  // set the reference to the users collection in the firebase database
  users = () =>this.db.ref('users')
}

export default Firebase

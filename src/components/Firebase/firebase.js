// firebase.js
// the configuration for Firebase
import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// the constant value when the environment = 'production'
const prodConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
}

// the constant value when the environment !== 'production'
const devConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
}

// set the config constant to the appropriate value
const config = process.env.NODE_ENV = 'production' ? prodConfig : devConfig

class Firebase {
  constructor() {
    // initialize the app with the Firebase configconfig
    app.initializeApp(config)
    // set the current auth to the configured auth
    this.auth = app.auth()
    this.db = app.database
  }

  // ***** Auth API ***** (use the offical Firebase endpoint)
  doCreateUserWithEmailAndPassword = ( email, password ) => this.auth.createUserWithEmailAndPassword( email, password )

  // ***** SignIn ***** (use the offical Firebase endpoint)
  doSignInWithEmailAndPassword = ( email, password ) => this.auth.SignInWithEmailAndPassword( email, password )

  // ***** SignOut ***** (use the offical Firebase endpoint)
  doSignOut = ( email, password ) => this.auth.SignOut()

  // ***** Password Reset ***** (use the offical Firebase endpoint)
  doPasswordReset = email => this.auth.sendPasswordResetEmail( email )

  // ***** Password Update ***** (use the offical Firebase endpoint)
  doPasswordUpdate = password => this.auth.currentUser.updatePassword( password )

  users = () => this.db.ref('users')

  // ***** Merge Auth and DB User API *****
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if ( authUser ) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val()
            
            // default empty roles
            if ( !dbUser.roles ) {
              dbUser.roles ={}
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

  // ***** User API ***** (use the offical Firebase endpoint)
  user = uid => this.db.ref(`users/${uid}`)
}

export default Firebase

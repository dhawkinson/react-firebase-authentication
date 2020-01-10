// index.js - Firebase
// imports then exports ALL Firebase config & context functionality 
import FirebaseContext, { withFirebase } from './context'   //  Provider & Consumer
import Firebase from './firebase'   //  the firebase configuration

export default Firebase

export { FirebaseContext, withFirebase }

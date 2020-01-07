// index.js
// imports then exports ALL Firebase functionality 
// (Firebase class, Firebase context for both consuming and providing components)

import FirebaseContext, { withFirebase } from './context'
import Firebase from './firebase'

export default Firebase

export { FirebaseContext, withFirebase }

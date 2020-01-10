// context.js - Firebase
// create the Firebase context for the app
// FirebaseContext.Provider provides the instance of Firebase within the app
// FirebaseContext.Consumer is used to retrieve the Firebase instance by a component that needs it
import React from 'react'

const FirebaseContext = React.createContext(null)

// create the HOC 'withFirebase' for consuming FirebaseContext
export const withFirebase = Component => props => (
  // consume Firebase Context
  <FirebaseContext.Consumer>
    { firebase => <Component { ...props } firebase={ firebase } />}
  </FirebaseContext.Consumer>
)

export default FirebaseContext
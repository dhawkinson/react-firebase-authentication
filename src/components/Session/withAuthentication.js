// withAuthenication.js
// a HOC to handle user authentication -- keeps the App component lean and clean
import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props)

      // initialize the authUser to null
      this.state = {
        // NOTE: this is a trick to prevent the flicker caused by activation in the listener
        authUser: JSON.parse(localStorage.getItem( 'authUser' ))
      }
    }

    // NOTE: localStorage API is used to set and remove items that can be identified by a key
    // thereby giving universal access to those items
    componentDidMount() {
      // on mount activate the listener for authUser
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          // set State authUser and localStorage API item when found
          this.setState({ authUser })
          localStorage.setItem('authUser', JSON.stringify(authUser))
        },
        // or set State authUser to null and remove localStorage API item
        () => { 
          this.setState({ authUser: null }) 
          localStorage.removeItem('authUser')
        }
      )
    }

    componentWillUnmount() {
      // shut down the listener on unmount to prevent memory leaks
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;

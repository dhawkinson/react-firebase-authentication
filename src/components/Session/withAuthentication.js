// withAuthenication.js
// a HOC to handle user authentication -- cares making merged authUser available through local storage
import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        authUser: JSON.parse(localStorage.getItem( 'authUser' ))     // NOTE: this is a trick to prevent the flicker caused by activation in the listener
      }
    }
    // NOTE: localStorage API is used to set and remove items that can be identified by a key thereby giving universal access to those items
    componentDidMount() {
      // on mount activate the listener for authUser
      this.listener = this.props.firebase.onAuthUserListener(        //  this.listener = onAuthUserListener(next, fallback) from firebase.js
        authUser => {                                                //  the 'next' callback - setState authUser & localStorage API item authUser
          localStorage.setItem('authUser', JSON.stringify(authUser))
          this.setState({ authUser })
        },
        () => {                                                      //  the 'fallback' callback - setState authUser=null and remove localStorage API item 
          localStorage.removeItem('authUser')
          this.setState({ authUser: null })
        }
      )
    }
    componentWillUnmount() {
      this.listener()                                                //  shut down the listener on unmount to prevent memory leaks
    }
    render() {
      // returns the authUser context -- Provider side
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

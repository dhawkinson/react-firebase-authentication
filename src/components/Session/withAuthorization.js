// withAuthorization.js
// a HOC to handle authorization -- cares about redirecting
import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    // upon mounting the component, listen for an authUser if not an authUser or no user redirect to SIGN_IN
    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(        //  this.listener = onAuthUserListener(next, fallback) from firebase.js
        authUser => {                                                //  the "next" callback
          if ( !condition(authUser) ) {
            this.props.history.push(ROUTES.SIGN_IN)
          }
        },                                                           //  the "fallback" callback
        () => this.props.history.push(ROUTES.SIGN_IN)
      )
    }
    // on unmount - shut down the listener to prevent memory leaks
    componentWillUnmount() {
      this.listener();
    }
    // if authUser -- redirect to the specified Component else do nothing
    render() {
      // return the consumer side of AuthUserContext
      return (
        <AuthUserContext.Consumer>
          {authUser => condition(authUser) ? <Component {...this.props} /> : null}
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;

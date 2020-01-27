// SignInGoogle.js - SignIn
//  the google SignIn component
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import Button from 'react-bootstrap/Button'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

// ==============================
// ***** signin with google *****
// ==============================
class SignInGoogleBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null
    }
  }

  onSubmit = event => {
    this.props.firebase
      // execute the firebase method for google login
      // utilizes firebase SignInWithPopup method using the googleProvider (set up in Firebase/firebase.js)
      .doSignInWithGoogle()
      // success - create a user in the Firebase Realtime Database too
      .then(socialAuthUser => {
        return this.props.firebase
          .user(socialAuthUser.user.uid)
          .set({
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            signInMethod: 'google',
            roles: {},
          })
      })
      // set state (error to null) and redirect to Home Page
      .then(socialAuthUser => {
        this.setState({
          error: null
        })
        this.props.history.push(ROUTES.HOME)
      })
      // fail - set state (error)
      .catch(error => {
        this.setState({
          error
        })
      })

    // prevent a rerender
    event.preventDefault()
  }

  render() {
    const { error } = this.state

    return ( 
      <form className = 'container google' onSubmit = { this.onSubmit }>
        <Button className = 'item btn btn-secondary' type = 'submit' > SIGN IN WITH GOOGLE </Button>

        { error && <p> { error.message } </p> }
      </form>
    )
  }
}
  
const SignInGoogle = compose(withRouter, withFirebase, )(SignInGoogleBase)

export default SignInGoogle
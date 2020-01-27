// SignInFacebook.js - SignIn
//  the facebook SignIn component
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import Button from 'react-bootstrap/Button'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

// ================================
// ***** signin with facebook *****
// ================================
class SignInFacebookBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
        error: null
    }
  }

  onSubmit = event => {
    this.props.firebase
      // execute the firebase method for facebook login
      .doSignInWithFacebook()
      // create a user in the Firebase Realtime Database too
      .then(socialAuthUser => {
        return this.props.firebase
          .user(socialAuthUser.user.uid)
          .set({
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
            signInMethod: 'facebook',
            roles: {},
          })
      })
      // success - set state (error to null) and redirect to Home Page
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
      <form 
        className = 'container facebook' 
        onSubmit = { this.onSubmit } 
      >
        <Button 
          className = 'item btn btn-secondary' 
          type = 'submit' 
        >
          SIGN IN WITH FACEBOOK
        </Button>

        { error && <p> { error.message } </p> }
      </form>
    )
  }
}
  
const SignInFacebook = compose(withRouter, withFirebase, )(SignInFacebookBase)

export default SignInFacebook
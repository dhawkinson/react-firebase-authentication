// SignInTwitter.js - SignIn
//  the twitter SignIn component
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import Button from 'react-bootstrap/Button'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

// ===============================
// ***** signin with twitter *****
// ===============================
class SignInTwitterBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null
    }
  }

  onSubmit = event => {
    this.props.firebase
      // execute the firebase method for twitter login
      .doSignInWithTwitter()
      // create a user in the Firebase Realtime Database too
      .then(socialAuthUser => {
        return this.props.firebase
          .user(socialAuthUser.user.uid)
          .set({
            username: socialAuthUser.additionalUserInfo.profile.name,
            signInMethod: 'twitter',
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
      <form className = 'container twitter' onSubmit = { this.onSubmit } >
        <Button className = 'item btn btn-secondary' type = 'submit' > SIGN IN WITH TWITTER </Button>

        { error && <p> { error.message } </p> } 
      </form>
    )
  }
}
  
const SignInTwitter = compose(withRouter, withFirebase, )(SignInTwitterBase)

export default SignInTwitter
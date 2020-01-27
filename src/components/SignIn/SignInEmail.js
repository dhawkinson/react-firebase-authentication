// SignInEmail.js - SignIn
//  the email/password SignIn component
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { Typography, Input } from '@material-ui/core'
import Button from 'react-bootstrap/Button'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

// initialize the state of the component using destructuring
// allows INITIAL_STATE to be reset after successful SignUp
const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  roles: {},
  error: null,
}

// ======================================
// ***** signin with email/password *****
// ======================================
class SignInEmailBase extends Component {
  constructor(props) {
    super(props)

    // spread operator (...) spreads out to reach all properties individually
    this.state = {
      ...INITIAL_STATE
    }
  }

  onSubmit = event => {
    // get necessary info from this.state to pass to the Firebase authentication API
    // const { username, email, password, roles } = this.state
    const { email, password } = this.state

    this.props.firebase
      // execute SignIn function (create a user)
      .doSignInWithEmailAndPassword( email, password )
      // successful
      .then(() => {
        // update state and redirect to Home page
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.HOME)
      })
      // error - setState, error (if something is wrong)
      .catch(error => {
        this.setState({
          error
        })
      })
    // prevent default behavior (a reload of the browser)
    event.preventDefault()
  }

  onChange = event => {
    // dynamically set state properties when they change, based on which input call is executed
    // each <input> element (in the return) operates on a different property of state (according to value)
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    // parse each of the values from current state
    const { email, password, error } = this.state

    // list of invalid conditions for which to check (validation of form elements)
    const isInvalid = password === '' || email === ''

    return (
      // the input form -- with fields (username, email, passwordOne, passwordTwo)
      <div className = 'container signin-page'>
        <Typography 
          variant = 'h6' 
          align = 'center' 
          className = 'item' 
        >
          Sign In Page
        </Typography> 
        <br />
        <form className = 'item email-form' onSubmit = { this.onSubmit} >
          <Input 
            className = 'item' 
            name = 'email' 
            value = { email } 
            onChange = { this.onChange } 
            type = 'text' 
            placeholder = 'Email Address' 
          />
          <br />
          <Input 
            className = 'item' 
            name = 'password' 
            value = { password } 
            onChange = { this.onChange } 
            type = 'password' 
            placeholder = 'Password' 
          />
          <br />
          { /* disable the button if the form is invalid -- see isInvalid above */ } 
          <Button 
            className = 'item btn btn-secondary' 
            type = 'submit' 
            disabled = { isInvalid } 
          >
            SIGN IN WITH EMAIL
          </Button>

          { /* if there is an error (a default Firebase property), render the error message */ }
          { error && <p> { error.message } </p> } 
        </form>
      </div>
    )
  }
}

const SignInEmail = compose(withRouter, withFirebase, )(SignInEmailBase)

export default SignInEmail
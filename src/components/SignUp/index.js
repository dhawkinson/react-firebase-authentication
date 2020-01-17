// index.js - SignUp
//  the entry point for the SignUp component
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { Typography, Input, Checkbox, FormLabel, Button } from '@material-ui/core'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'

import '../../styles/auth.css'

const SignUpPage = () => (
  <div id='wrapper'>
    <div className='container'>
      <SignUpForm />
    </div>
  </div>
)

// initialize the state of the component using destructuring
// allows INITIAL_STATE to be reset after successful SignUp
const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
}

class SignUpFormBase extends Component {
  constructor(props) {
    super(props)

    // spread operator (...) spreads out to reach all properties individually
    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    // get necessary info from this.state to pass to the Firebase authentication API
    const { 
      username, 
      email, 
      passwordOne, 
      isAdmin,
    } = this.state

    const roles = {}

    if ( isAdmin ) {
      roles[ROLES.ADMIN] = ROLES.ADMIN
    }

    this.props.firebase
      // create a user (limited access) in the authentication database
      .doCreateUserWithEmailAndPassword( email, passwordOne )
      // successful 
      .then( authUser => {
        // create a user (full access) in Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({ 
            username, 
            email, 
            roles, 
          })
      })
      .then(() => {
        // update state and redirect to Home page
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.HOME)
      })
      // error - setState, error (if something is wrong)
      .catch(error => {
        this.setState({ error })
      })
    // prevent default behavior (a reload of the browser)
    event.preventDefault()
  }

  onChange = event => {
    // dynamically set state properties when they change, based on which input call is executed
    // each <input> element (in the return) operates on a different property of state (according to value)
    this.setState({ [event.target.name]: event.target.value })
  }

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked })
  }

  render() {
    // parse each of the values from current state
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error
    } = this.state

    // list of invalid conditions for which to check (validation of form elements)
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      // the input form -- with fields (username, email, passwordOne, passwordTwo)
      <form className='container signup' onSubmit={ this.onSubmit }>
        <Typography 
          variant='h6'
          className='item'
        >
          Sign Up Page
        </Typography>
        <br />
        <Input
          className='item'
          name='username'
          value={username}
          onChange={this.onChange}
          type='text'
          placeholder='Full Name'
        />

        <br />

        <Input
          className='item'
          name='email'
          value={email}
          onChange={this.onChange}
          type='text'
          placeholder='Email Address'
        />

        <br />

        <Input
          className='item'
          name='passwordOne'
          value={passwordOne}
          onChange={this.onChange}
          type='password'
          placeholder='Password'
        />

        <br />

        <Input
          className='item'
          name='passwordTwo'
          value={passwordTwo}
          onChange={this.onChange}
          type='password'
          placeholder='Confirm Password'
        />

        <br />

        <FormLabel>
          Admin:
          <Checkbox
            name='isAdmin'
            checked={isAdmin}
            onChange={this.onChangeCheckbox}
          />
        </FormLabel>

        <br />

        {/* disable the button if the form is invalid -- see isInvalid above */}
        <Button
          variant='contained'
          className='item' 
          disabled={ isInvalid } 
          type='submit'
          >
            Sign Up
        </Button>

        {/* if there is an error (a default Firebase property), render the error message */}
        {error && <p>{ error.message }</p>}
      </form>
    )
  }
  
}

const SignUpLink = () => (<p>Don't have an account? <Link to={ ROUTES.SIGN_UP }>Sign Up</Link></p>)

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase)

export default SignUpPage

export { SignUpForm, SignUpLink }

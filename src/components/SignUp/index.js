// index.js
// the entry point for the SignUp components
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'

import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/routes'

// build the SignUp page
const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
)

// initialize the state of the component usinr destructuring
// in this way the individual state elements can be used as needed
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

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    // get necessary info from this.state to pass to the Firebase authentication API
    const { username, email, passwordOne, isAdmin } = this.state
    const roles = {}

    if ( isAdmin ) {
      roles[ROLES.ADMIN] = ROLES.ADMIN
    }

    this.props.firebase
      // execute SignUp function (create a user)
      .doCreateUserWithEmailAndPassword( email, passwordOne )
      // successful 
      .then( authUser => {
        // create a user in Firebase Realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({ username, email, roles, })
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
    // dynamically set state properties, based on which input call is executed
    // each <input> element (in the return) operates on a different property of state
    this.setState({ [event.target.name]: event.target.value })
  }

  onChangeCheckbox = event => {
    this.setState({ [ event.target.name ]: event.target.checked })
  }

  render() {

    // destructure (current) state into its individual properties
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state

    // list of invalid conditions for which to check (validation of form elements)
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      // input the elements of state
      // set the incoming value with value from local state
      // handle changes to value with onChange function
      <form onSubmit={this.onSubmit}>
        <input
          name='username'
          value={username}
          onChange={this.onChange}
          type='text'
          placeholder='Full Name'
        />
        <input
          name='email'
          value={email}
          onChange={this.onChange}
          type='text'
          placeholder='Email Address'
        />
        <input
          name='passwordOne'
          value={passwordOne}
          onChange={this.onChange}
          type='password'
          placeholder='Password'
        />
        <input
          name='passwordTwo'
          value={passwordTwo}
          onChange={this.onChange}
          type='password'
          placeholder='Confirm Password'
        />
        <label>
          Admin:
          <input name='isAdmin' type='checkbox' checked={isAdmin} onChange={this.onChangeCheckbox} />
        </label>

        <br />

        {/* disable the button if the form is invalid */}
        <button disabled={ isInvalid } type='submit'>Sign Up</button>

        {/* if there is an error (a default Firebase property), render the error message */}
        {error && <p>{ error.message }</p>}
      </form>
    )
  }
}

const SignUpLink = () => (
  <p>Don't have an account? <Link to={ROUTES.SIGN_UP}></Link></p>
)

// build up (compose) the SignUpForm by attaching withRouter and withFirebase to SignUpFormBase
// giving it access to both router and Firebase properties
const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase)

export default SignUpPage

export { SignUpForm, SignUpLink }

// index.js
// the entry point for the PasswordForget component
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

// define password forgot page
const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget Page</h1>
    <PasswordForgetForm />
  </div>
)

// set the initial state
const INITIAL_STATE = {
  email: '',
  error: null,
}

// define the base page
class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    const { email } = this.state

    this.props.firebase
      // execute the Firebase method for password reset
      .doPasswordReset(email)
      // then update the state
      .then(() => {
        this.setState({ ...INITIAL_STATE })
      })
      // or set the error into state
      .catch(error => {
        this.setState({ error })
      })
    
    // prevent the defult behavior
    event.preventDefault()
  }

  onChange = event => {
    // update state with the changed value
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { email, error } = this.state

    const isInvalid = email === ''

    // enter the email address for which the password is being changed
    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        {/* select to reset the password */}
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {/* or render the error */}
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const PasswordForgetLink = () => (
  // redirect the password reset link
  <p><Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link></p>
)

export default PasswordForgetPage

// compose the form with the Firebase properties
const PasswordForgetForm = withFirebase(PasswordForgetFormBase)

export { PasswordForgetForm, PasswordForgetLink }

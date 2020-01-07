// index.js
// the entry point for the PasswordChange component
import React, { Component } from 'react'

import { withFirebase } from '../Firebase'

// initialize state
const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props)

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    // get current state
    const { passwordOne } = this.state

    this.props.firebase
      // execute Firebase password update method
      .doPasswordUpdate(passwordOne)
      // then reset state
      .then(() => {
        this.setState({ ...INITIAL_STATE })
      })
      // process error
      .catch(error => {
        this.setState({ error })
      })

    // prevent default behavior (rerender of page)
    event.preventDefault()
  }

  onChange = event => {
    // set the target by name
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    // destructure the current state
    const { passwordOne, passwordTwo, error } = this.state

    // validity check
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === ''

    return (
      // input the password and confirmation password
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />
        {/* submit to reset */}
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {/* render an error if present */}
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

export default withFirebase(PasswordChangeForm)

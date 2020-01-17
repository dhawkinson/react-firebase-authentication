// index.js - PasswordChange
//  the entry point for the PasswordChange component
import React, { Component } from 'react'

import { Typography, Input, Button } from '@material-ui/core'

import { withFirebase } from '../Firebase'

import '../../styles/auth.css'

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
      <div id='wrapper'>
        <form className='container pw-change' onSubmit={this.onSubmit}>
          <Typography 
            variant='h6'
            className='item'
          >
            Password Change Page
          </Typography>
          <br />
          <Input
            className='item'
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="New Password"
          />
          <Input
            className='item'
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm New Password"
          />
          {/* submit to reset */}
          <Button  
            className='item'
            variant='contained'
            disabled={isInvalid} type="submit">
            Reset My Password
          </Button>

          {/* render an error if present */}
          {error && <p>{error.message}</p>}
        </form>
      </div>
    )
  }
}

export default withFirebase(PasswordChangeForm)

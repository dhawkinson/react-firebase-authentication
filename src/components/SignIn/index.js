// index.js
// the entry point for the SignIn components
import React, {
  Component
} from 'react'
import {
  withRouter
} from 'react-router-dom'
import {
  compose
} from 'recompose'

import {
  SignUpLink
} from '../SignUp'
import {
  PasswordForgetLink
} from '../PasswordForget'
import {
  withFirebase
} from '../Firebase'
import * as ROUTES from '../../constants/routes'

const SignInPage = () => ( <
  div >
  <
  h1 > Sign In < /h1> <
  SignInForm / >
  <
  PasswordForgetLink / >
  <
  SignUpLink / > {
    /* <SignInGoogle />
        <SignInFacebook />
        <SignInTwitter /> */
  } <
  /div>
)

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

class SignInFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...INITIAL_STATE
    }
  }

  onSubmit = event => {
    // deconstruct variables from state
    const {
      email,
      password
    } = this.state

    this.props.firebase
      // execute the Firebase SignIn method using deconstructed variables
      .doSignInWithEmailAndPassword(email, password)
      // success - set state $ push history for redirect to Home page
      .then(() => {
        this.setState({
          ...INITIAL_STATE
        })
        this.props.history.push(ROUTES.HOME)
      })
      // error set state with error
      .catch(error => {
        this.setState({
          error
        })
      })

    // prevent default behavior (rerender of page)
    event.preventDefault()
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    // this render block is similar to the reendeer block for SignUp
    // check out the comments there
    const {
      email,
      password,
      error
    } = this.state

    const isInvalid = password === '' || email === ''

    return ( <
      form onSubmit = {
        this.onSubmit
      } >
      <
      input name = "email"
      value = {
        email
      }
      onChange = {
        this.onChange
      }
      type = "text"
      placeholder = "Email Address" /
      >
      <
      input name = "password"
      value = {
        password
      }
      onChange = {
        this.onChange
      }
      type = "password"
      placeholder = "Password" /
      >
      <
      button disabled = {
        isInvalid
      }
      type = "submit" >
      Sign In <
      /button>

      {
        error && < p > {
            error.message
          } < /p>} <
          /form>
      )
    }

  }

  // similar compose block as in SignUp
  const SignInForm = compose(
    withRouter,
    withFirebase,
  )(SignInFormBase)

  export default SignInPage

  export {
    SignInForm
  }
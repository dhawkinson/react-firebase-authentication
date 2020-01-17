// index.js - SignIn
//  the entry point for the SignIn component
import React from 'react'

import SignInEmail from './SignInEmail'
import SignInFacebook from './SignInFacebook'
import SignInGoogle from './SignInGoogle'
import SignInTwitter from './SignInTwitter'
import { SignUpLink } from '../SignUp'
import { PasswordForgetLink } from '../PasswordForget'

import '../../styles/auth.css'

const SignInPage = () => ( 
  <div id = 'wrapper' >
    <SignInEmail />
    <br />
    <PasswordForgetLink />
    <br />
    <p > ***** OR ***** </p> 
    <br />
    <SignInFacebook />
    <br />
    <SignInGoogle />
    <br />
    <SignInTwitter />
    <br />
    <SignUpLink />
  </div>
)

export default SignInPage

// index.js - SignIn
//  the entry point for the SignIn component
import React from 'react'

import { Typography } from '@material-ui/core'

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
    <SignUpLink />
    <br />
    <PasswordForgetLink />
    <br />
    <Typography 
      variant = 'body1' 
      align = 'center' 
      className = 'item' 
    > 
      ***** OR *****
      </Typography> 
    <br />
    <SignInFacebook />
    <br />
    <SignInGoogle />
    <br />
    <SignInTwitter />
  </div>
)

export default SignInPage

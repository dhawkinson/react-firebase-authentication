// index.js - SignOut
//  the entry point for the SignOut component
import React from 'react'

import Button from 'react-bootstrap/Button'

import { withFirebase } from '../Firebase'

const SignOutButton = ({ firebase }) => (
  <Button 
    className = 'item btn btn-secondary'
    type="button" 
    onClick={firebase.doSignOut}
    style={{width: '30%'}}
  >
    Sign Out
  </Button>
)

export default withFirebase(SignOutButton)

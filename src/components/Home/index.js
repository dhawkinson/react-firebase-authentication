// index.js - Home
// the entry point for the Home component
import React from 'react';
import { compose } from 'recompose';

import { Typography } from '@material-ui/core'

import { withAuthorization } from '../Session'
// import { withAuthorization, withEmailVerification } from '../Session';
// import Messages from '../Messages';

const HomePage = () => (
  <div>
    <Typography 
      variant = 'h6' 
      align = 'center'
      className = 'item' 
    >
      Home Page
    </Typography> 
    <br />
    <Typography 
      variant = 'body1' 
      align = 'center'
      className = 'item' 
    >
      Accessible by every signed in user.
    </Typography>

    {/* <Messages /> */}
  </div>
);

// set the condition to true when we have an authUser (by virtue of the double negative)
const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
)(HomePage);

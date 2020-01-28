// index.js - Navigation
//  the entry point for the Navigation component
import React from 'react'
import { Link } from 'react-router-dom'

import { AuthUserContext } from '../Session'
import SignOutButton from '../SignOut'
import * as ROUTES from '../../constants/routes'

import '../../styles/nav.css'

const Navigation = () => (
  <div className='nav-context-consumer'>
    <AuthUserContext.Consumer>
      { authUser => authUser ? (<NavigationAuth authUser={authUser} />) : (<NavigationNonAuth />) }
    </AuthUserContext.Consumer>
  </div>
)

const NavigationAuth = ( { authUser } ) => (
  <div className='nav-auth'>
    <ul className='nav-list'>
      {/* NOTE: only authorized users have access to these routes */}
      <li><Link to={ROUTES.LANDING}>Landing</Link></li>
      <li><Link to={ROUTES.HOME}>Home</Link></li>
      <li><Link to={ROUTES.ACCOUNT}>Account</Link></li>
      <li><SignOutButton /></li>
    </ul>
  </div>
)

const NavigationNonAuth = () => (
  <div className='nav-nonauth'>
    <ul className='nav-list'>
      {/* non authorized users only have access to these routes */}
      <li><Link to={ROUTES.LANDING}>Landing</Link></li>
      <li><Link to={ROUTES.SIGN_IN}>Sign In</Link></li>
    </ul>
  </div>
)

export default Navigation

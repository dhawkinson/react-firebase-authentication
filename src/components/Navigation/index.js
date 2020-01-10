// index.js - Navigation
//  the entry point for the Navigation component
import React from 'react'
import { Link } from 'react-router-dom'

import { AuthUserContext } from '../Session'
import SignOutButton from '../SignOut'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      { authUser => authUser ? (<NavigationAuth authUser={authUser} />) : (<NavigationNonAuth />) }
    </AuthUserContext.Consumer>
  </div>
)

const NavigationAuth = ( { authUser } ) => (
  <div>
  <ul>
    {/* authorized users have access to these pages */}
    <li><Link to={ROUTES.SIGN_IN}>Sign In</Link></li>
    <li><Link to={ROUTES.LANDING}>Landing</Link></li>
    <li><Link to={ROUTES.HOME}>Home</Link></li>
    <li><Link to={ROUTES.ACCOUNT}>Account</Link></li>
    { !!authUser.roles[ROLES.ADMIN] && ( <li><Link to={ROUTES.ADMIN}>Admin</Link></li> )}
    <li><SignOutButton /></li>
  </ul>
  </div>
)

const NavigationNonAuth = () => (
  <div>
    <ul>
      {/* non authorized users only have access to these pages */}
      <li><Link to={ROUTES.LANDING}>Landing</Link></li>
      <li><Link to={ROUTES.SIGN_IN}>Sign In</Link></li>
    </ul>
  </div>
)

export default Navigation

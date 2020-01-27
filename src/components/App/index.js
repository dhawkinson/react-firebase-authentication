// index.js - App
//  the entry point for the App component
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { withAuthentication } from '../Session'

import * as ROUTES from '../../constants/routes'

import Navigation from '../Navigation'
import LandingPage from '../Landing'
import SignUpPage from '../SignUp'
import SignInPage from '../SignIn'
import PasswordForgetPage from '../PasswordForget'
import HomePage from '../Home'
import AccountPage from '../Account'
import AdminPage from '../Admin'

import 'typeface-roboto'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => (

  <Router>
    <div className='App'>
      <Navigation />

      <hr />

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
    </div>
  </Router>
)

// withAuthentication brings the AuthUserContext.Provider with it, making it available to App & thereby to App's children
export default withAuthentication(App)
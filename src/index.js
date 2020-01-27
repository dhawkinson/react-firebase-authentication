// index.js - src
// overall app entry point
import React from 'react'
import ReactDOM from 'react-dom'

import './styles/index.css'
import * as serviceWorker from './serviceWorker'

import App from './components/App'
import Firebase, { FirebaseContext } from './components/Firebase'

ReactDOM.render(
  // Make Firebase Context available to the app
  // By placing the FirebaseContext.Provider here, it assures that Firebase will only be instantiated once.
  <FirebaseContext.Provider value={ new Firebase() }>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

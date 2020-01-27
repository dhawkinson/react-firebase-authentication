// index.js - Admin
// The entry point for the Admin component
// NOTE: Only available to authenticated users with ADMIN role, failure on either condition = redirect to LogIn
import React, { Component } from 'react'

import { Typography } from '@material-ui/core'

import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import { withAuthorization } from '../Session'
import * as ROLES from '../../constants/roles';

// import { Switch, Route } from 'react-router-dom';

// import { UserList, UserItem } from '../Users';
// import * as ROUTES from '../../constants/routes';

import '../../styles/admin.css'

class AdminPage extends Component {
  constructor(props) {
    super(props)

    // initial local state
    this.state = {
      loading: false,
      users: [],
    }
  }

  componentDidMount() {
    this.setState({ loading: true })                               // set state loading true
    this.props.firebase.users().on('value', snapshot => {          // register a continuous listener -- triggered every time user changes
      const usersObject = snapshot.val()                           // set a users object (collection) from the snapshot
      const usersList = Object.keys(usersObject).map(key => ({     // map the list of keys (uids) from the usersObject
        ...usersObject[key],
        uid: key,
      }))
      this.setState({                                              // set state users and loading
        users: usersList,
        loading: false,
      })
    })
  }
  componentWillUnmount() {
    this.props.firebase.users().off()                              // turn the listener off to prevent memory leaks
  }
  render() {
    const { users, loading } = this.state                          // deconstruct state
    return (
      <div id='wrapper'>
        <div className='container admin'>
          <Typography 
            variant = 'h6' 
            align = 'center' 
            className = 'item' 
          >
            Admin Page
          </Typography> 
          <br />
          <Typography 
            variant = 'body1' 
            align = 'center'
            className = 'item' 
          >
            Accessible by Signed In ADMIN users.
          </Typography> 
          <br />
          { loading && <div>Loading ...</div> }
          <UserList users={users} />
        </div>
      </div>
    )
  }
}
const UserList = ({ users }) => (
  <div className='container'>
    <ul className='user-list'>
      {users.map(user => (
        <li key={user.uid} className='item'>
          <span><strong>ID:</strong> { user.uid }</span>
          <span><strong>E-mail:</strong> { user.email }</span>
          <span><strong>Username:</strong> { user.username }</span>
        </li>
      ))}
    </ul>
  </div>
)
// set condition to true when an authUser has the Admin role (by virtue of the double negative)
const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN]

export default compose(withAuthorization(condition), withFirebase)(AdminPage)

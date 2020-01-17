// index.js - Admin
//  the entry point for the Admin component
import React, { Component } from 'react'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import { withAuthorization } from '../Session'
import * as ROLES from '../../constants/roles';

// import { Switch, Route } from 'react-router-dom';

// import { UserList, UserItem } from '../Users';
// import * as ROUTES from '../../constants/routes';

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
    // set state loading true
    this.setState({ loading: true })

    // register a continuous listener -- triggered every time something changes
    this.props.firebase.users().on('value', snapshot => {
      // set a users object (collection) from the snapshot
      const usersObject = snapshot.val()
      
      // map the list of keys (uids) from the usersObject
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }))

      // set state users and loading
      this.setState({
        users: usersList,
        loading: false,
      })
    })
  }

  // turn the listener off to prevent memory leaks
  componentWilUnmount() {
    this.props.firebase.users().off()
  }

  render() {
    // deconstruct state
    const { users, loading } = this.state
    return (
      <div>
        <h1>Admin</h1>
        <p>The Admin Page is accessible by every signed in Admin user.</p>
        { loading && <div>Loading ...</div> }
        <UserList users={users} />
      </div>
    )
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span><strong>ID:</strong> { user.uid }</span>
        <span><strong>E-mail:</strong> { user.email }</span>
        <span><strong>Username:</strong> { user.username }</span>
      </li>
    ))}
  </ul>
)

// set condition to authUser when  authUser has the Admin role (by virtue of the double negative)
const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN]

export default compose(withAuthorization(condition), withFirebase)(AdminPage)

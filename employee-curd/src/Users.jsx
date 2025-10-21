import React from 'react'
import axios from 'axios'
function Users() {
  const [users, setUsers] = React.useState([])
  React.useEffect(() => {
    
    axios.get('http://localhost:8080/getAll').then(response => setUsers(response.data));
  }, [])

  
  
  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
        

      </ul>
    </div>
  )
}

export default Users

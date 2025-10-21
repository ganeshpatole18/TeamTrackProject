import { Routes, Route } from 'react-router-dom'
import Welcome from './Welcome'
import Login from './Login'
import Profile from './Profile'
import Users from './Users'
import Dashboard from './Dashboard'
import Register from './Register'

import './App.css'

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Welcome/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/profile/:email' element={<Profile/>} />
        <Route path='/users' element={<Users/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/register' element={<Register/>} />
        
      </Routes>
    </>
  )
}

export default App

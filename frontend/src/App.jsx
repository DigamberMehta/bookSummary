import React from 'react'
import Login from './pages/Login'
import { AuthProvider } from './context/authContext'
import { Outlet } from 'react-router-dom'


const App = () => {
  return (
    <>
      <AuthProvider>
         <Outlet />
     </AuthProvider>
    </>

  )
}

export default App

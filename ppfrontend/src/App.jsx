import { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Login from './pages/Mentor/Login'

import DeanRoute from './pages/DeanRoute'
import MentorRoute from './pages/MentorRoute'
import HODRoute from './pages/HODRoute'
import AdminRoute from './pages/AdminRoute'

import { HODPro } from './context/HODPro'
import { DeanPro } from './context/DeanPro'
import { MentorPro } from './context/MentorPro'
import { AdminPro } from './context/AdminPro'
import AuthCon from './context/AuthPro'

function App() {
  const { user, auth } = useContext(AuthCon)
  const navi = useNavigate();

  useEffect(() => {
    if (!auth && window.location.pathname !== '/') {
      navi('/');
    }
  }, [])

  return (
    <>
      {user && user.role === 'mentor' &&
        <MentorPro>
          {console.log("MentorRoute", user)}
          <MentorRoute />
        </MentorPro>}
      {user && user.role === 'dean' &&
        <DeanPro>
          {console.log("DeanRoute", user)}
          <DeanRoute />
        </DeanPro>}
      {user && user.role === 'HOD' &&
        <HODPro>
          {console.log("HodRoute", 1, user)}
          <HODRoute />
        </HODPro>}
      {user && user.role === 'admin' &&
        <AdminPro>
          {console.log("AdminRoute", 1, user)}
          <AdminRoute />
        </AdminPro>}
      <Routes>
        <Route path='/' element={(!auth && !user) ? <Login /> : <></>} />
      </Routes>
    </>

  )
}

export default App

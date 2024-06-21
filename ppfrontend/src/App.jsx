import { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css';

import Login from './pages/Mentor/Login'

import DeanRoute from './pages/DeanRoute'
import MentorRoute from './pages/MentorRoute'
import HODRoute from './pages/HODRoute'
import AdminRoute from './pages/AdminRoute'
import StudentRoute from './pages/StudentRoute'
import ParentRoute from './pages/ParentRoute'
import CoorRoute from './pages/CoorRoute'

import { HODPro } from './context/HODPro'
import { DeanPro } from './context/DeanPro'
import { MentorPro } from './context/MentorPro'
import { AdminPro } from './context/AdminPro'
import { StudentPro } from './context/StudentPro'
import { ParentPro } from './context/ParentPro'
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
      {user && user.role === 'student' &&
        <StudentPro>
          <StudentRoute />
        </StudentPro>}
      {user && user.role === 'parent' &&
        <ParentPro>
          <ParentRoute />
        </ParentPro>}
      {user && user.role === 'mentor' &&
        <MentorPro>
          <MentorRoute />
        </MentorPro>}
      {user && user.role === 'dean' &&
        <DeanPro>
          <DeanRoute />
        </DeanPro>}
      {user && user.role === 'HOD' &&
        <HODPro>
          <HODRoute />
        </HODPro>}
      {user && user.role === 'admin' &&
        <AdminPro>
          <AdminRoute />
        </AdminPro>}
      {user && user.role === 'coor' &&
        <AdminPro>
          <CoorRoute />
        </AdminPro>}
      <Routes>
        <Route path='/' element={(!auth && !user) ? <Login /> : <></>} />
      </Routes>
    </>

  )
}

export default App

import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

/* Admin */
import AdminHome from './Admin/AdminHome'
import AuthCon from '../context/AuthPro'
import Header from './Admin/components/Header'
import Events from './Admin/Events'
/* Admin */

export default function MentorRoute() {
  const { auth, user } = useContext(AuthCon)

  return (
    <>
      {auth && user && user.role === 'admin' && <Header />}
      {
        auth && user && user.role === 'admin' &&
        <Routes>
          <Route path='/' element={<AdminHome />} />
          <Route path='/setevent' element={<Events />} />
        </Routes>
      }
    </>
  )
}

import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

/* Admin */
import AdminHome from './Admin/AdminHome'
import AuthCon from '../context/AuthPro'
import Header from './Admin/components/Header'
import Events from './Admin/Events'
import Students from './Admin/Students'
import Attendence from './Admin/Attendence'
import Test from './Admin/Test'
import Companies from './Admin/Companies'
import CurrEvent from './Admin/CurrEvent'
import Announcements from './Admin/Announcements'
import AdminSettings from './Admin/AdminSettings'
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
          <Route path='/currevent/:eid' element={<CurrEvent />} />
          <Route path='/students' element={<Students />} />
          <Route path='/companies' element={<Companies />} />
          <Route path='/attendence' element={<Attendence />} />
          <Route path='/tests' element={<Test />} />
          <Route path='/announcements' element={<Announcements />} />
          <Route path='/settings' element={<AdminSettings />} />
        </Routes>
      }
    </>
  )
}

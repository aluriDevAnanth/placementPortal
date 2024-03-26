import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

/* Dean */
import AuthCon from '../context/AuthPro'
import MenteesList from './Dean/MenteesList'
import MenteeSearch from './Dean/MenteeSearch'
import MentorFeedback from './Dean/MentorFeedback'
import DeanSettings from './Dean/DeanSettings'
import DeanHome from './Dean/DeanHome'
import Header from './Dean/components/Header'
/* Dean */

export default function MentorRoute() {
  const { user, auth } = useContext(AuthCon)

  return (
    <>
      {auth && user && user.role === 'dean' && <Header />}
      {auth && user && <>
        <Routes>
          <Route path='/' element={<DeanHome />} />
          <Route path='/menteeslist' element={<MenteesList />} />
          <Route path='/menteesearch' element={<MenteeSearch />} />
          <Route path='/mentorfeedback' element={<MentorFeedback />} />
          <Route path='/deansettings' element={<DeanSettings />} />
        </Routes>
      </>
      }
    </>
  )
}

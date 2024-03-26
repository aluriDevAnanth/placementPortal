import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

/* HOD */
import AuthCon from '../context/AuthPro'
import Header from './HOD/components/Header'
import MentorList from './HOD/MentorList'
import MenteesList from './HOD/MenteesList'
import MentorFeedback from './HOD/MentorFeedback'
import MenteeSearch from './HOD/MenteeSearch'
import HODHome from './HOD/HODHome'
/* HOD */

export default function HODRoute() {
  const { auth, user } = useContext(AuthCon)

  return (
    <>
      {(auth === undefined && user !== undefined) ? <></> : <Header />}
      {
        (user != null) && <>
          <Routes>
            <Route path='/' element={<HODHome />} />
            <Route path='/mentorlist' element={<MentorList />} />
            <Route path='/menteeslist' element={<MenteesList />} />
            <Route path='/mentorfeedback' element={<MentorFeedback />} />
            <Route path='/menteesearch' element={<MenteeSearch />} />
          </Routes>
        </>
      }

    </>
  )
}

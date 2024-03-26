import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

/* Mentor */
import AuthCon from '../context/AuthPro'
import PracticeReport from './Mentor/PracticeReport'
import Attendence from './Mentor/Attendence'
import TestSchedule from './Mentor/TestSchedule'
import MentorFeedback from './Mentor/MentorFeedback'
import StudentProgress from './Mentor/StudentProgress'
import MenteeSearch from './Mentor/MenteeSearch'
import Header from './Mentor/components/Header'
import MenteesMail from './Mentor/MenteesMail'
import CompaniesCorner from './Mentor/CompaniesCorner'
import MentorSettings from './Mentor/MentorSettings'
import MentorHome from './Mentor/MentorHome'
/* Mentor */

export default function MentorRoute() {
  const { auth, user } = useContext(AuthCon)

  return (
    <>
      {auth && user && user.role === 'mentor' && <Header />}
      {
        (auth && user != null && user.role === 'mentor') && (
          <Routes>
            <Route path='/' element={<MentorHome />} />
            <Route path='/practicereport' element={<PracticeReport />} />
            <Route path='/studentprogress' element={<StudentProgress />} />
            <Route path='/attendence' element={<Attendence />} />
            <Route path='/testschedule' element={<TestSchedule />} />
            <Route path='/mentorfeedback' element={<MentorFeedback />} />
            <Route path='/menteesearch' element={<MenteeSearch />} />
            <Route path='/menteesmail' element={<MenteesMail />} />
            <Route path='/companiescorner' element={<CompaniesCorner />} />
            <Route path='/settings' element={<MentorSettings />} />
          </Routes>
        )
      }
    </>
  )
}

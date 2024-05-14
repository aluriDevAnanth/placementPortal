import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

/* Mentor */
import AuthCon from '../context/AuthPro'
import MenteesPractiseDetails from './Mentor/MenteesPractiseDetails'
import MenteesTrainingAttendance from './Mentor/MenteesTrainingAttendance'
import TestSchedule from './Mentor/TestSchedule'
import MentorFeedback from './Mentor/MentorFeedback'
import MenteeCompanyDashboard from './Mentor/MenteeCompanyDashboard'
import CompanyDetails from './Mentor/CompanyDetails'
import Header from './Mentor/components/Header'
import MenteesMail from './Mentor/MenteesMail'
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
            <Route path='/menteespractisedetails' element={<MenteesPractiseDetails />} />
            <Route path='/studentprogress' element={<MenteeCompanyDashboard />} />
            <Route path='/menteestrainingattendance' element={<MenteesTrainingAttendance />} />
            <Route path='/testschedule' element={<TestSchedule />} />
            <Route path='/mentorfeedback' element={<MentorFeedback />} />
            <Route path='/companydetails' element={<CompanyDetails />} />
            <Route path='/menteesmail' element={<MenteesMail />} />
            <Route path='/settings' element={<MentorSettings />} />
          </Routes>
        )
      }
    </>
  )
}

import { useContext, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import AuthCon from '../context/AuthPro'

/* Parent */
import ParentHeader from './Parent/components/ParentHeader'
import ParentHome from './Parent/ParentHome'
import PlacementPolicy from './Parent/PlacementPolicy'
import ParentAttendance from './Parent/ParentAttendance'
import ParentTestSchedule from './Parent/ParentTestSchedule'
import ParentCompaniesCorner from './Parent/ParentCompaniesCorner'
import ParentPlacementCorner from './Parent/ParentPlacementCorner'
import MentorDetails from './Parent/MentorDetails'
import ParentContactUs from './Parent/ParentContactUs'
import AlumniRep from './Parent/AlumniRep'
import ParentSettings from './Parent/ParentSettings'
import ParentTestResult from './Parent/ParentTestResult'
import MyPractise from './Parent/MyPractise'
/* Parent */

export default function MentorRoute() {
  const { auth, user } = useContext(AuthCon)

  return (
    <>
      {auth && user && user.role === 'parent' && <ParentHeader />}
      {
        (auth && user && user.role === 'parent') ?
          <>
            {<Routes>
              <Route path='/' element={<ParentHome />} />
              <Route path='/placementpolicy' element={<PlacementPolicy />} />
              <Route path='/attendence' element={<ParentAttendance />} />
              <Route path='/settings' element={<ParentSettings />} />
              {/* <Route path='/mentordetails' element={<MentorDetails />} />
              <Route path='/alumnirep' element={<AlumniRep />} />
              <Route path='/mypractise' element={<MyPractise />} />
              <Route path='/placementcorner' element={<ParentPlacementCorner />} /> 
              <Route path='/testresult' element={<ParentTestResult />} /> */}
              <Route path='/contactus' element={<ParentContactUs />} />
            </Routes>}
          </>
          : <></>
      }
    </>
  )
}

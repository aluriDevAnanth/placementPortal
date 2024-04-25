import { useContext, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import AuthCon from '../context/AuthPro'

/* Mentor */
import StudentHome from './Student/StudentHome'
import StudentHeader from './Student/components/StudentHeader'
import StudentAtt from './Student/StudentAtt'
import RevMat from './Student/RevMat'
import ContactUs from './Student/ContactUs'
import PlacementCorner from './Student/PlacementCorner'
import Settings from './Student/Settings'
import StuCompFeed from './Student/StuCompFeed'
import StudentFeedback from './Student/StudentFeedback'
/* Mentor */

export default function MentorRoute() {
  const { auth, user } = useContext(AuthCon)
  const [SCF, setSCF] = useState()
  const [completed, setCompleted] = useState(null)

  async function fetchStuCompFeed() {
    const response = await fetch(`http://localhost:3000/api/student/getStuCompFeed/${user.batch}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setSCF(res.data.feed)
    setCompleted(res.data.completed)
  }

  useEffect(() => {
    if (auth && user) {
      fetchStuCompFeed();
    }
  }, [])


  return (
    <>
      {auth && user && user.role === 'student' && <StudentHeader />}
      {
        (auth && user && user.role === 'student') ?
          <>
            {SCF && !completed && <Routes>
              <Route path='/' element={<StudentHome />} />
              <Route path='/studentattendence' element={<StudentAtt />} />
              <Route path='/revisionmaterial' element={<RevMat />} />
              <Route path='/placementcorner' element={<PlacementCorner />} />
              <Route path='/studentfeedback' element={<StudentFeedback />} />
              <Route path='/studentcompanyfeedback' element={<StuCompFeed SCF={SCF} completed={completed} setSCF={setSCF} />} />
              <Route path='/contactus' element={<ContactUs />} />
              <Route path='/settings' element={<Settings />} />
            </Routes>}
            {SCF && completed && <Routes>
              <Route path='*' element={<StuCompFeed SCF={SCF} fetchStuCompFeed={fetchStuCompFeed} completed={completed} setSCF={setSCF} />}></Route>
            </Routes>}
          </>
          : <></>
      }
    </>
  )
}

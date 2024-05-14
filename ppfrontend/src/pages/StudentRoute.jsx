import { useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import AuthCon from '../context/AuthPro';

/* Student */
import StudentHome from './Student/StudentHome';
import StudentHeader from './Student/components/StudentHeader';
import StudentAtt from './Student/StudentAtt';
import RevMat from './Student/RevMat';
import ContactUs from './Student/ContactUs';
import PlacementCorner from './Student/PlacementCorner';
import Settings from './Student/Settings';
import StuCompFeed from './Student/StuCompFeed';
import StudentFeedback from './Student/StudentFeedback';
import PlacementPolicy from './Student/PlacementPolicy';
import MyPerformance from './Student/MyPerformance'
import MyPractise from './Student/MyPractise';
import StudentCompaniesCorner from './Student/StudentCompaniesCorner';
import AlumniRep from './Student/AlumniRep';
/* Student */

export default function MentorRoute() {
  const { auth, user } = useContext(AuthCon);
  const [SCF, setSCF] = useState([]);
  const [completed, setCompleted] = useState(false);

  async function fetchStuCompFeed() {
    try {
      const response = await fetch(`http://localhost:3000/api/student/getStuCompFeed/${user.batch}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      setSCF(res.data.feed);
      //console.log(res.data.feed);
      setCompleted(res.data.completed);
    } catch (error) {
      console.error("Error fetching student company feed:", error);
    }
  }

  useEffect(() => {
    if (auth && user) {
      fetchStuCompFeed();
    }
  }, [auth, user]);

  return (
    <>
      {auth && user && user.role === 'student' && <StudentHeader />}
      {auth && user && user.role === 'student' && (
        <Routes>
          <Route path='/' element={<StudentHome />} />
          <Route path='/placementpolicy' element={<PlacementPolicy />} />
          <Route path='/placementcorner' element={<PlacementCorner />} />
          <Route path='/studentattendence' element={<StudentAtt />} />
          <Route path='/myperformance' element={<MyPerformance />} />
          <Route path='/mypractise' element={<MyPractise />} />
          <Route path='/alumnirep' element={<AlumniRep />} />
          <Route path='/revisionmaterial' element={<RevMat />} />
          <Route path='/studentfeedback' element={<StudentFeedback />} />
          <Route path='/studentcompanyfeedback' element={<StuCompFeed SCF={SCF} completed={completed} setSCF={setSCF} fetchStuCompFeed={fetchStuCompFeed} />} />
          {/* <Route path='/companiescorner' element={<StudentCompaniesCorner />} /> */}
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      )}
    </>
  );
}

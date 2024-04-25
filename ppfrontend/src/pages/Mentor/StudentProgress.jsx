import React, { useContext, useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'
import MentorCon from '../../context/MentorPro'
import Table from 'react-bootstrap/Table';

export default function StudentProgress() {
  const { user, auth } = useContext(AuthCon);
  const { students, year } = useContext(MentorCon)
  const [PP, setPP] = useState()

  async function fetchStudentPlacementProgress() {
    const rollno = students.map(q => q.rollno);
    const response = await fetch(`http://localhost:3000/api/mentor/getStudentPlacementProgress/${year.curr}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ rollno }),
    });
    const res = await response.json();
    setPP(res.data);
  }

  useEffect(() => {
    if (students && year) {
      fetchStudentPlacementProgress();
    }
  }, [students, year])

  return (
    user !== null && <div className='bodyBG'>
      <div className='container-fluid'>
        <div className='d-flex'>
          <div className=''>
            <Sidebar />
          </div>
          <div className='flex-fill ms-3'>
            {students && PP && <Table size="sm" striped bordered hover>
              <thead>
                <tr className='text-center text-light fw-bold'>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Eligible Companies </th>
                  <th>Applied Companies </th>
                  <th>Online Test</th>
                  <th>GD</th>
                  <th>Interview</th>
                  <th>HR</th>
                  <th>Other Stages</th>
                  <th>Placed</th>
                  <th>Placed Company</th>
                  <th>Placed Company CTC</th>
                </tr>
              </thead>
              <tbody>
                {students.map((q, i) => {
                  return (
                    <tr className="text-center" key={i}>
                      <td>{q.name}</td>
                      <td>{q.rollno}</td>
                      <td>{q.branch}</td>
                      <td>CGPA</td>
                      <th>{PP.eligibleCompany[q.rollno]?.length || 0}</th>
                      <th>{PP.appliedCompany[q.rollno]?.length || 0}</th>
                      <th>{PP.stages[q.rollno]?.ot?.length || 0}</th>
                      <th>{PP.stages[q.rollno]?.gd?.length || 0}</th>
                      <th>{PP.stages[q.rollno]?.inter?.length || 0}</th>
                      <th>{PP.stages[q.rollno]?.hr?.length || 0}</th>
                      <th>{PP.stages[q.rollno]?.other?.length || 0}</th>
                      <th>{PP.placed[q.rollno]?.[0] ? "Placed" : "Not Placed"}</th>
                      <th>{PP.placed[q.rollno]?.[0]?.name || "-"}</th>
                      <th>{PP.placed[q.rollno]?.[0]?.CTC || "-"}</th>
                    </tr>
                  );

                })}
              </tbody>
            </Table>}
          </div>
        </div>
      </div>
    </div>
  )
}

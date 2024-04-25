import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'
import Table from 'react-bootstrap/Table';

export default function PlacementCorner() {
  const { user, auth } = useContext(AuthCon)
  const [company, setCompany] = useState();
  const [show, setShow] = useState(false);
  const [userStage, setUserStage] = useState();
  const [PP, setPP] = useState();

  async function fetchCompanies() {
    const response = await fetch(`http://localhost:3000/api/student/setComp/${user.batch}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setCompany([...res.data.comp]);
  }

  async function fetchStudentPlacementProgress() {
    const rollno = [user.rollno];
    const response = await fetch(`http://localhost:3000/api/mentor/getStudentPlacementProgress/${user.batch}`, {
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
    if (user) {
      fetchCompanies();
      fetchStudentPlacementProgress();
    }
  }, [user])

  useEffect(() => {
    if (company && user.rollno) {
      let userStageInfo = company.map(q => {
        const qq = Object.keys(q.stages).map((s, i) => {
          const qqq = q.stages[s].some(stage => stage.includes(user.rollno));

          if (qqq) q.currStage = s;
        })
        return qq
      });
      const filteredData = [];
      for (let item of userStageInfo) {
        for (let i of item) {
          if (i !== null && i !== undefined) {
            filteredData.push(i);
          }
        }
      }
      //console.log(company);
      setUserStage(filteredData);
    }
  }, [company, user.rollno]);

  return (
    <div className='d-flex container-fluid'>
      <div className='me-4'>
        <Sidebar />
      </div>
      <div className='w-100'>
        <p className='fs-2 fw-bold'>PlacementCorner</p>
        {PP && <Table size="sm" striped bordered hover responsive>
          <thead>
            <tr className='text-center text-light fw-bold'>
              <th>Student</th>
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
            {[user].map((q, i) => {
              return (
                <tr className="text-center" key={i}>
                  <td>{q.name}</td>
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
        <button onClick={() => { setShow(!show) }} className='btn btn-primary mb-3'>Toggle to Show more Info</button>
        <Table hidden={!show} striped bordered hover responsive>
          <thead>
            <tr className='text-center text-light fw-bold'>
              <th>#</th>
              <td> Name </td>
              <td> Job Role </td>
              <td> CTC </td>
              <td> Category</td>
              <td>Batch</td>
              <td>Mode Of Drive</td>
              <td>At Stages</td>
            </tr>
          </thead>
          <tbody>
            {company && userStage &&
              company.map((q, i) => {
                return <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{q.name}</td>
                  <td>{q.jodRole}</td>
                  <td>{q.CTC}</td>
                  <td>{q.category}</td>
                  <td>{q.batch}</td>
                  <td>{q.modeOfDrive}</td>
                  <td>{q.currStage ? q.currStage : 'Not Applied or Eligible'}</td>
                </tr>
              })
            }
          </tbody>
        </Table>

      </div>
    </div>
  )
}

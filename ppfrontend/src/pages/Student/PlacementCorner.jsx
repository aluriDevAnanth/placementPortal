import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'
import Table from 'react-bootstrap/Table';

export default function PlacementCorner() {
  const { user, auth } = useContext(AuthCon)
  const [company, setCompany] = useState();
  const [show, setShow] = useState(false);
  const [PP, setPP] = useState();
  const baseURL = process.env.BASE_URL

  async function fetchCompanies() {
    const response = await fetch(`${baseURL}/student/getComp/${user.yearofpassing}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    console.log('res.data.comp', [...res.data.comp]);
    setCompany([...res.data.comp]);
  }

  async function fetchStudentPlacementProgress() {
    const rollno = [user.rollno];
    const response = await fetch(`${baseURL}/mentor/getStudentPlacementProgress/${user.yearofpassing}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ rollno }),
    });
    const res = await response.json();
    setPP(res.data);
    //console.log(res.data);
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
          const qqq = Object.values(q.stages[s]).includes(user.rollno);
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
      //console.log(11, company);
    }
  }, [company, user.rollno]);

  useEffect(() => {
    if (company) {
      var table = $('#PlacementCorner').DataTable({
        orderCellsTop: true, destroy: true,
        initComplete: function () {
          $('#PlacementCorner thead tr:eq(1) th.text_search').each(function () {
            var title = $(this).text();
            $(this).html(`<input type="text" placeholder=" ${title}" class="form-control column_search" />`);
          });

        }
      });
      $('#PlacementCorner thead').on('keyup', ".column_search", function () {
        table
          .column($(this).parent().index())
          .search(this.value)
          .draw();
      });
    }
  }, [company]);

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
              <th>Shortlisted Companies </th>
              <th>Online Test 1</th>
              <th>Online Test 2</th>
              <th>Online Test 3</th>
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
              let s = 1
              return (
                <tr className="text-center" key={i}>
                  <th>{q.name}</th>
                  <th>CGPA</th>
                  <th>{PP.eligibleCompany[q.rollno]?.length || 0}</th>
                  <th>{PP.appliedCompany[q.rollno]?.length || 0}</th>
                  <th>{PP?.shortlistedCompany[q?.rollno]?.length || 0}</th>
                  <th>{PP.stages[q.rollno]?.ot?.length || 0}</th>
                  <th>{PP.stages[q.rollno]?.gd?.length || 0}</th>
                  <th>{PP.stages[q.rollno]?.inter1?.length || 0}</th>
                  <th>{PP.stages[q.rollno]?.inter2?.length || 0}</th>
                  <th>{PP.stages[q.rollno]?.inter3?.length || 0}</th>
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
        <div hidden={!show}>
          <Table id="PlacementCorner" className='w-100' striped bordered hover size='sm'>
            <thead>
              <tr className='text-center text-light fw-bold'>
                <th>#</th>
                <th> Name </th>
                <th> Job Role </th>
                <th> CTC </th>
                <th> driveStatus</th>
                <th>Mode Of Drive</th>
                <th>Is Eligible</th>
                <th>Is Applied</th>
                <th>Is Shortlisted</th>
                <th>Online Test</th>
                <th>GD</th>
                <th>Interview</th>
                <th>HR</th>
                <th>Other Stages</th>
              </tr>
              <tr className='text-center text-light fw-bold'>
                <th className='text_search'>#</th>
                <th className='text_search'> Name </th>
                <th className='text_search'> Job Role </th>
                <th className='text_search'> CTC </th>
                <th className='text_search'> driveStatus</th>
                <th className='text_search'>Mode Of Drive</th>
                <th className='text_search'>Is Eligible</th>
                <th className='text_search'>Is Applied</th>
                <th className='text_search'>Is Shortlisted</th>
                <th className='text_search'>Online Test</th>
                <th className='text_search'>GD</th>
                <th className='text_search'>Interview</th>
                <th className='text_search'>HR</th>
                <th className='text_search'>Other Stages</th>
              </tr>
            </thead>
            <tbody>
              {company && user.rollno && company.map((q, i) => {
                console.log(company);
                return <tr className='text-center' key={i}>
                  <th>{i + 1}</th>
                  <th>{q.name}</th>
                  <th>{q.jobRole}</th>
                  <th>{q.CTC}</th>
                  <th>{q.driveStatus}</th>
                  <th>{q.modeOfDrive}</th>
                  <th>{q.eligibleStudents.includes(user.rollno) ? "Yes" : "No"}</th>
                  <th>{q.appliedStudents.includes(user.rollno) ? "Yes" : "No"}</th>
                  <th>{q.shortlistedStudents.includes(user.rollno) ? "Yes" : "No"}</th>
                  <th> {q?.stages?.onlineTest?.[user.rollno]} </th>
                  <th> {q.stages.GD?.[user.rollno]} </th>
                  <th> {q.stages.interview?.[user.rollno]} </th>
                  <th> {q.stages.HR?.[user.rollno]} </th>
                  <th> {q.stages.otherStages?.[user.rollno]} </th>
                </tr>
              })
              }
            </tbody>
          </Table>
        </div>

      </div>
    </div>
  )
}

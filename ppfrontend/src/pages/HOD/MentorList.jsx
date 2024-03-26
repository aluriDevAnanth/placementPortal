import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'

export default function MentorList() {
  const { auth } = useContext(AuthCon)
  const [men, setMen] = useState()

  async function getMentorList() {
    const response = await fetch(`http://localhost:3000/api/hod/getMentorList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    //console.log(res.data)
    setMen(res.data.results)
    console.log(res)
  }

  useEffect(() => {
    getMentorList()
  }, [])


  return (
    <div className='d-flex'>
      <div className='me-3'>
        <Sidebar />
      </div>
      <div className='flex-fill me-5'>
        <div className='d-flex gap-3'>
          <p className='fs-3 fw-bolder'>Search</p>
          <div>
            <input className='form-control' type="text" />
          </div>
          <div>
            <button className='btn btn-primary' >Search</button>
          </div>
        </div>
        <div>
          <table className='table table-striped table-hover table-bordered'>
            <thead>
              <tr className="text-center text-light">
                <th>Mentors</th>
                <th>Email</th>
                <th>No of Mentees</th>
              </tr>
            </thead>
            <tbody>
              {men &&
                men.map((q, i) => {
                  return <tr key={i} className='text-center'>
                    <th>{q.mentor}</th>
                    <th>{q.mentoremail}</th>
                    <th>{q.menteecount}</th>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

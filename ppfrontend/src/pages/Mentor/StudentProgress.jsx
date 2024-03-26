import React, { useContext, useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'
import MentorCon from '../../context/MentorPro'

export default function StudentProgress() {
  const { user } = useContext(AuthCon);
  const { students } = useContext(MentorCon)

  const handleOV = (e) => {
    console.log(e.currentTarget)
  }

  return (
    user !== null && <div className='bodyBG'>
      <div className='container-fluid'>
        <div className='d-flex'>
          <div className=''>
            <Sidebar />
          </div>
          <div className='flex-fill ms-3'>
            <table className='table table-striped table-bordered table-hover w-100'>
              <tbody>
                <tr className='text-center text-light fw-bold'><td>Student</td><td>Roll No</td><td>Branch</td></tr>
                {students && students.map((q, i) => {
                  return <tr className="text-center" key={i}>
                    <td>{q.name}</td>
                    <td><span className="badge text-bg-secondary fs-6" onClick={handleOV} data={q.rollno}>{q.rollno}</span></td>
                    <td>{q.branch}</td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

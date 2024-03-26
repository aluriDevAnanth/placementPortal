import React, { useContext, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import HODCon from '../../context/HODPro'

export default function MenteeSearch() {
  const { year, stu, mentors } = useContext(HODCon)
  const [curr, setCurr] = useState()

  const handleSearch = (e) => {
    const rollno = document.getElementById('rollno').value
    //console.log(stu, mentors, rollno)
    const q = stu.find(q => q.rollno === rollno)
    setCurr(q)
    console.log(q, curr)
  }

  return (
    <div>
      <div className='d-flex'>
        <div className='me-3'>
          <Sidebar />
        </div>
        <div className='flex-fill me-5'>
          <p className='fw=bold fs-3'>Student Search</p>
          <div className='d-flex gap-3'>
            <div>
              <input id='rollno' name="rollno" type='text' className='form-control' />
            </div>
            <div>
              <button onClick={handleSearch} className='btn btn-primary' >Search</button>
            </div>
          </div>
          <div className='mt-3'>
            <table className='table table-hover table-striped table-bordered'>
              <thead>
                <tr className="text-center">
                  <th >Rollno</th>
                  <th >Name</th>
                  <th >Branch</th>
                  <th >Course</th>
                  <th >Mentor</th>
                </tr>
              </thead>
              <tbody>
                {curr && <tr className="text-center">
                  <th >{curr.rollno}</th>
                  <th >{curr.name}</th>
                  <th >{curr.branch}</th>
                  <th >{curr.course}</th>
                  <th >{curr.mentor}</th>
                </tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

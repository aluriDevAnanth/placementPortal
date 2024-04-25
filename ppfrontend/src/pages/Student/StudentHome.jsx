import React from 'react'
import Sidebar from './components/Sidebar'
import ListGroup from 'react-bootstrap/ListGroup';

export default function StudentHome() {
  return (
    <div className='container-fluid d-flex'>
      <div className=''>
        <Sidebar />
      </div>
      <div className='flex-fill border-4 border-dark container-fluid'>
        <div className='row'>
          <div className='col-9 d-flex flex-column'>
            <div className='d-flex flex-column bg-white rounded-4 p-3'>
              <p className='fs-5 fw-bold text-center'>Weekly Attendence</p>
              <p  > <span className=' fw-bold'>NOTE:</span> Students you may refer to the detailed attendance for further clarifications on above consolidated attendance, we have not considered Barclays attendance for computing weekly attendance. Also students are marked as "present" only if they have spent minimum of 80% time in the session.Students who have not met 80% in weekly attendance will not be allowed into placement process.</p>
            </div>
          </div>
          <div className='col-3 bg-white border-3 rounded-4 p-3'>
            <p className='fs-5 fw-bold'>Announcement</p>
            <p>Students should attend all the training program organised by the University, attendance will be viewed seriously.</p>
            <p className='fs-5 fw-bold'>Your Skill Level</p>
            <ListGroup>
              <ListGroup.Item>Above 90 Excellent</ListGroup.Item>
              <ListGroup.Item>Above 80 Very good</ListGroup.Item>
              <ListGroup.Item>Above 70 Good</ListGroup.Item>
              <ListGroup.Item>Above 60 Average</ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

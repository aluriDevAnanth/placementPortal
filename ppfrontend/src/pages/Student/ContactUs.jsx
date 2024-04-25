import React from 'react'
import Sidebar from './components/Sidebar'

export default function ContactUs() {
  return (
    <div className=' container-fluid d-flex'>
      <div >
        <Sidebar />
      </div>
      <div>
        <div className='ms-3 bg-white p-3 rounded-4'>
          <p className='fs-3 fw-bold'>Corporate Relations & Career Services</p>
          <a href="mailto:crcs.helpdesk@srmap.edu.in" className='fs-6 btn btn-primary'>crcs.helpdesk@srmap.edu.in   <span class="badge text-bg-warning"> Click Me!</span> </a>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import Sidebar from './components/ParentSidebar'

export default function ParentContactUs() {
  return (
    <div className=' container-fluid d-flex'>
      <div >
        <Sidebar />
      </div>
      <div>
        <div className='ms-3 bg-white p-3 rounded-4'>
          <p className='fs-3 fw-bold'>Corporate Relations & Career Services</p>
          <a onClick={navigator.clipboard.writeText("08632343020")} className='mb-2 text-white btn btn-primary link-underline link-underline-opacity-0' href="tel:08632343020">Call 08632343020</a><br />
          <a onClick={navigator.clipboard.writeText("crcs.helpdesk@srmap.edu.in")} href="mailto:crcs.helpdesk@srmap.edu.in" className='fs-6 btn btn-primary'>crcs.helpdesk@srmap.edu.in   <span class="badge text-bg-warning"> Click To Copy!</span> </a>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

import Sidebar from './components/Sidebar'

export default function AdminHome() {
  return (
    <div className='h-100'>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3'>
          <div className='container w-100'>
            AdminHome
          </div>
        </div>
      </div>
    </div>
  )
}

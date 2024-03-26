import React, { useContext, useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'
import Search from './components/Search'
import MentorCon from '../../context/MentorPro'

export default function MentorHome() {
  const { students } = useContext(MentorCon)
  const { user } = useContext(AuthCon)

  const mystyle = {
    backgroundColor: "#696747 !important",
  };

  return (
    user && <div className='bodyBG'>
      <div className='container-fluid'>
        <div className='d-flex'>
          <div className='me-5'>
            <Sidebar />
          </div>
          {students && <Search mystyle={mystyle} students={students} />}
        </div>
      </div>
    </div>
  )
}

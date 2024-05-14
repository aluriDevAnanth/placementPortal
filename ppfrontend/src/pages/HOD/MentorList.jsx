import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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
        <div>
          <DataTable removableSort sortMode="multiple" sortField="mentor" sortOrder={1} value={men} paginator rows={10} rowsPerPageOptions={[25, 50]} showGridlines stripedRows filterDisplay="row">
            <Column sortable field="mentor" header="Mentors" filter filterMatchMode="contains" />
            <Column sortable field="mentoremail" header="Email" filter filterMatchMode="contains" />
            <Column sortable field="menteecount" header="No of Mentees" filter filterMatchMode="contains" />
          </DataTable>
        </div>
      </div>
    </div>
  )
}

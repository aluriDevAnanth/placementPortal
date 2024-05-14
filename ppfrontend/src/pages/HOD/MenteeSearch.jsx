import React, { useContext, useState } from 'react'
import Sidebar from './components/Sidebar'
import HODCon from '../../context/HODPro'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function MenteeSearch() {
  const { year, stu, mentors } = useContext(HODCon)

  return (
    <div>
      <div className='d-flex'>
        <div className='me-3'>
          <Sidebar />
        </div>
        <div className='flex-fill me-3'>
          <p className='fw=bold fs-3'>Student Search</p>
          <div className='mt-3'>
            {stu && (
              <DataTable value={stu} showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="rollno" sortOrder={1} removableSort className="p-datatable-striped" filterDisplay="row" emptyMessage="No Mentor found.">
                <Column field="rollno" header="Roll No" className="text-center" sortable filter filterMatchMode="contains" />
                <Column field="name" header="Name" className="text-center" sortable filter filterMatchMode="contains" />
                <Column field="branch" header="Branch" className="text-center" sortable filter filterMatchMode="contains" />
                <Column field="mentor" header="Mentor" className="text-center" sortable filter filterMatchMode="contains" />
              </DataTable>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

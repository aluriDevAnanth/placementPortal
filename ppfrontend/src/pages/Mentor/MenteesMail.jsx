import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import MentorCon from "../../context/MentorPro";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function MenteesMail() {
  const { user, auth } = useContext(AuthCon);
  const { students } = useContext(MentorCon);
  const [sel, setSel] = useState(null);
  const [rowClick, setRowClick] = useState(true);

  return (
    user !== null && (
      <div className='container-fluid'>
        <div className='d-flex'>
          <div className='me-3'>
            <Sidebar />
          </div>
          {students && <div className='flex-fill p-3 bg-white rounded-3' >
            {sel && <div className='mb-3'>
              <button onClick={() => { navigator.clipboard.writeText(sel.map(q => { return q.email }).join(', ')) }} className="btn btn-primary mb-2">Click to Copy to Clipboard</button>
              <p>{sel.map(q => { return q.email }).join(', ')}</p>
            </div>}
            <DataTable value={Object.values(students)} selectionMode={rowClick ? null : 'checkbox'} selection={sel} onSelectionChange={(e) => setSel(e.value)} removableSort sortMode="multiple" sortField="name" sortOrder={1} emptyMessage="No Students found." paginator rows={10} rowsPerPageOptions={[25, 50]} filterDisplay="row">
              <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
              <Column sortable filter filterPlaceholder="Search" field="name" header="Name" filterMatchMode="contains"></Column>
              <Column sortable filter filterPlaceholder="Search" field="rollno" header="Roll No" filterMatchMode="contains"></Column>
              <Column sortable filter filterPlaceholder="Search" field="email" header="Email" filterMatchMode="contains"></Column>
            </DataTable>
          </div>}
        </div>
      </div >
    )
  );
}

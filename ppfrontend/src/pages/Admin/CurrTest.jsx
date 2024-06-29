import React, { useContext, useEffect, useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import { useParams } from 'react-router-dom';
import AuthCon from '../../context/AuthPro';
import AdminCon from '../../context/AdminPro';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format, parseISO } from 'date-fns';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

const baseURL = process.env.BASE_URL

const StuTable = ({ test, stu, fetchEvent }) => {
  if (!test || !stu) return null;
  const { auth } = useContext(AuthCon);
  const toast = useRef(null);
  const [data, setData] = useState()

  useEffect(() => {
    const dataq = Object.keys(test.marks).map(r => {
      let s = stu[r.trim()];
      return {
        rollno: r,
        tid: test._id,
        name: s && s.name,
        att: test.students[r],
        aptitude: test.marks[r].aptitude,
        coding: test.marks[r].coding,
        others: test.marks[r].others
      };
    });
    setData(dataq)
  }, [test])


  const onRowEditComplete = async (e) => {
    let _products = [...data];
    let { newData, index } = e;
    _products[index] = { ...newData };

    const response = await fetch(`${baseURL}/admin/postTest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: e.newData }),
    });

    const res = await response.json();
    if (res.success) {
      toast.current.show({ severity: 'success', summary: 'Student Info updated', detail: newData.name, life: 6000 }); setData(_products);
    }

  };

  const allowEdit = (rowData) => {
    return true;
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  async function deleteStuTestEntry(e, data) {
    let con = confirm(`Do you want to delete details for thsi student ${data.name}`);
    if (con) {
      const response = await fetch(`${baseURL}/admin/deleteStuTestEntry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: data }),
      });

      const res = await response.json();
      if (res.success) {
        toast.current.show({ severity: 'error', summary: 'Student Info Deleted', detail: data.name, life: 6000 });
        fetchEvent();
      }
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <DataTable value={data} stripedRows reorderableColumns resizableColumns size='small' showGridlines paginator rows={20} rowsPerPageOptions={[30, 50, 100, 200]} filterDisplay="row" emptyMessage="No Students found." removableSort sortField="name" sortOrder={1} onRowEditComplete={onRowEditComplete} editMode="row">
        <Column rowEditor={allowEdit} bodyStyle={{ textAlign: 'center' }}></Column>
        <Column sortable filter filterMatchMode="contains" className='text-center' field="name" header="Name" />
        <Column editor={(options) => textEditor(options)} sortable filter filterMatchMode="contains" className='text-center' field="att" header="Att" />
        <Column editor={(options) => textEditor(options)} sortable filter filterMatchMode="contains" className='text-center' field="aptitude" header="Aptitude" />
        <Column editor={(options) => textEditor(options)} sortable filter filterMatchMode="contains" className='text-center' field="coding" header="Coding" />
        <Column editor={(options) => textEditor(options)} sortable filter filterMatchMode="contains" className='text-center' field="others" header="Others" />
        <Column editor={(options) => textEditor(options)} sortable filter filterMatchMode="contains" className='text-center' field="others" header="Others" body={(data) => {
          return <div>
            <button className='btn btn-outline-danger' onClick={(e) => { deleteStuTestEntry(e, data) }} ><i className="bi bi-trash"></i></button>
          </div>
        }} />
      </DataTable>
    </>

  );
};

export default function CurrTest() {
  const { tid } = useParams();
  const { auth } = useContext(AuthCon);
  const { stu } = useContext(AdminCon);
  const [test, setTest] = useState();
  const baseURL = process.env.BASE_URL

  useEffect(() => {
    if (auth) fetchEvent();
  }, [auth]);

  async function fetchEvent() {
    try {
      const response = await fetch(`${baseURL}/admin/getTest/${tid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      setTest(res.data.test);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  }

  return (
    <>
      <div className='container-fluid d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className=' ms-4'>
          {test && <div className='d-flex w-100 d-flex gap-3'>
            <p> <span className='fw-bold'>Name:</span> {test.name} | </p>
            <p> <span className='fw-bold'>Date:</span> {format(parseISO(test.date), 'dd-MM-yyyy hh:mm aa')} | </p>
            <p> <span className='fw-bold'>Batch:</span> {test.batch} | </p>
            <p> <span className='fw-bold'>Total:</span> {Object.keys(test.students).length} | </p>
            <p> <span className='fw-bold'>Present:</span> {Object.values(test.students).filter(q => q === 'present').length} | </p>
            <p> <span className='fw-bold'>Absent:</span> {Object.keys(test.students).length - Object.values(test.students).filter(q => q === 'present').length} </p>
          </div>}
          {test && stu && <StuTable fetchEvent={fetchEvent} test={test} stu={stu} />}
        </div>
      </div >
    </>
  );
}

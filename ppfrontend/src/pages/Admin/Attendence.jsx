import React, { useContext, useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';
import AdminCon from '../../context/AdminPro'
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';

import MentorCon from "../../context/MentorPro";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function AttTable({ students, totalEventAtt, eventAtt }) {
  const toast = useRef(null);
  const [expandedRows, setExpandedRows] = useState(null);

  let disObj = Object.values(students).map(q => {
    const percentage = (totalEventAtt[q.rollno] * 100).toFixed(2);
    return {
      name: q.name,
      rollno: q.rollno,
      per: isNaN(percentage) ? '0.00' : percentage
    };
  });

  const allowExpansion = (rowData) => {
    return true
  };

  const onRowExpand = (event) => {
    toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  };

  const onRowCollapse = (event) => {
    toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <p className='fs-5 fw-bold'>Attendence for {data.name}</p>
        <Accordion>
          {eventAtt[data.rollno].map(event => {
            let i = 0;
            const t = Object.keys(event.attendance).length;
            Object.keys(event.attendance).map(datee => {
              if (event.attendance[datee].includes(data.rollno)) i = i + 1;
            })
            return <Accordion.Item key={event.name} eventKey={event.name}>
              <Accordion.Header>{event?.name} - {((i / t) * 100).toFixed(2)} Precentage</Accordion.Header>
              <Accordion.Body>
                <div className="row">
                  <p className="p-6 col">des: {event.des}</p>
                  <p className="p-6 col">startTime: {event.startTime}</p>
                  <p className="p-6 col">endTime: {event.endTime}</p>
                  <p className="p-6 col">rec : {event.rec}</p>
                </div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.attendance && Object.keys(event.attendance).map(datee => (
                      <tr key={datee}>
                        <td>{datee}</td>
                        <td>{event.attendance[datee].includes(data.rollno) ? 'Present' : 'Absent'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          })}
        </Accordion>
      </div>
    );
  };

  return <>
    <Toast ref={toast} />
    <DataTable value={disObj} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
      onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate} reorderableColumns resizableColumns size='small' showGridlines stripedRows paginator rows={20} rowsPerPageOptions={[30, 50, 100, 200]} filterDisplay="row" emptyMessage="No Students found." removableSort sortField="name" sortOrder={1}>
      <Column expander={allowExpansion} style={{ width: '5rem' }} />
      <Column sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} field="name" header="Name" />
      <Column sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} field="per" header="Toatl attendence" />
    </DataTable>
  </>
}

function MenteesTrainingAttendance() {
  const { auth } = useContext(AuthCon);
  const { year } = useContext(AdminCon);
  const [students, setStudents] = useState()
  const [eventAtt, setEventAtt] = useState();
  const [totalEventAtt, setTotalEventAtt] = useState(0);
  const baseURL = process.env.BASE_URL

  async function fetchStudents() {
    const response1 = await fetch(`${baseURL}/mentor/getStudents/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response1.json();
    setStudents(res.data?.studentList)
  }

  const fetchEventAtt = async () => {
    let rollno = Object.keys(students);
    try {
      const response = await fetch(`${baseURL}/mentor/getEventAtt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        }, body: JSON.stringify({ rollno })
      });
      const res = await response.json();
      setEventAtt(res.data.att);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    if (auth && year) {
      fetchStudents();
    }
  }, [year, auth])

  useEffect(() => {
    if (eventAtt && Object.keys(eventAtt).length > 0) {
      let tt = {}
      Object.values(students).map(s => {
        let tot = 0;
        let presentCount = 0;
        eventAtt[s.rollno].map(event => {
          tot = tot + Object.keys(event.attendance).length;
          Object.keys(event.attendance).forEach(date => {
            if (event.attendance[date].includes(s.rollno)) presentCount++;
          });
          tt[s.rollno] = presentCount / tot;
        });
      })
      setTotalEventAtt(tt);
    }
  }, [eventAtt]);

  useEffect(() => {
    if (students) { fetchEventAtt(); }

  }, [students])

  return (
    <div className="container-fluid d-flex">
      <div className="  flex-fill bg-white p-3 rounded-3">
        <p className="fs-2 fw-bolder m-0"> Mentees Training Attendance</p>
        {students && totalEventAtt && eventAtt && <AttTable students={students} totalEventAtt={totalEventAtt} eventAtt={eventAtt} />}
      </div>
    </div >
  )
}

export default function Students() {
  const { auth } = useContext(AuthCon);
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState();
  const { stu, year, setStu } = useContext(AdminCon)
  const toast = useRef(null);
  const baseURL = process.env.BASE_URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const addAttBulk = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${baseURL}/admin/addAttBulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      setJsonData(res.data.jsonData);
      jsonData.map(q => {
        toast.current.show({ severity: 'info', summary: 'Attendence added', detail: `${q.rollno.length} students attendence added to ${q.name} for date ${q.date}`, life: 3000 });
      })
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container bg-white p-3 rounded-3 w-100'>
          <p className='fs-1 fw-bolder'>Attendence Management Portal</p>
          <form className='bg-white border p-3 rounded-3 ' onSubmit={addAttBulk}>
            <div className="mb-3 d-flex column-gap-3 align-items-center">
              <label htmlFor="formFile" className="form-label">Upload file here to add students attendence in bulk</label>
              <div className='flex-fill'>
                <input className="form-control" type="file" id="formFile" onChange={handleFileChange} accept=".xlsx, .xls" />
              </div>
              <Button type="submit" className="">Upload</Button>
            </div>
            <p className='fw-bold m-0' > <span className='text-danger'>use google sheets to prepare excel |</span>  <span className=' text-dark fw-bold m-0' > the format of date is dd-MM-yyyy hh:mm aa(14-06-2024 04:51 AM) | </span> <span className='text-danger fw-bold m-0' > Dont use any formulas to make excel </span></p>
          </form>
          <div>
            <Toast ref={toast} />
          </div>
        </div>
      </div>
      {stu && <div className='mt-3 container-fluid'>
        <Toast ref={toast} />
        <Tooltip target=".export-buttons>button" position="bottom" />
        <MenteesTrainingAttendance />
      </div>}
    </div>
  );
}

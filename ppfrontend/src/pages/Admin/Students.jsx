import React, { useContext, useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import AdminCon from '../../context/AdminPro'
import { Toast } from 'primereact/toast';
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';
import { Tooltip } from 'primereact/tooltip';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { Dialog } from 'primereact/dialog';

export default function Students() {
  const { auth } = useContext(AuthCon);
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState();
  const [show, setShow] = useState();
  const [show1, setShow1] = useState();
  const { stu, year, setStu, fetchStudents } = useContext(AdminCon)
  const toast = useRef(null);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [stuLogDet, setStuLogDet] = useState();
  const dt = useRef(null);
  const baseURL = process.env.BASE_URL

  const schema = {
    "type": "object",
    "properties": {
      "10": { "type": "string" },
      "12": { "type": "string" },
      "name": { "type": "string" },
      "rollno": { "type": "string" },
      "phone": { "type": "string" },
      "email": { "type": "string" },
      "batch": { "type": "string" },
      "personalemail": { "type": "string" },
      "gender": { "type": "string" },
      "residence": { "type": "string" },
      "address": { "type": "string" },
      "CGPA": { "type": "string" },
      "leetcode": { "type": "string" },
      "codechef": { "type": "string" },
      "hackerrank": { "type": "string" },
      "crcs": { "type": "string" },
      "dept": { "type": "string" },
      "parentname": { "type": "string" },
      "parentphone": { "type": "string" },
      "parentemail": { "type": "string" },
      "mentoremail": { "type": "string" },
      "spec": { "type": "string" },
      "skill": { "type": "string" },
      "yearofpassing": { "type": "string" },
      "school": { "type": "string" },
      "enrollmentstatus": { "type": "string" }
    },
    "required": [
      "name",
      "rollno",
      "phone",
      "email",
      "batch",
      "personalemail",
      "gender",
      "residence",
      "address",
      "CGPA",
      "leetcode",
      "codechef",
      "hackerrank",
      "crcs",
      "dept",
      "parentname",
      "parentphone",
      "parentemail",
      "mentoremail",
      "spec",
      "skill",
      "yearofpassing",
      "school",
      "enrollmentstatus"
    ]
  }

  const columns = [
    { field: 'personalemail', header: 'personalemail' },
    { field: 'residence', header: 'residence' },
    { field: 'address', header: 'address' },
    { field: 'leetcode', header: 'leetcode' },
    { field: 'codechef', header: 'codechef' },
    { field: 'hackerrank', header: 'hackerrank' },
    { field: 'crcs', header: 'crcs' },
    { field: 'parentname', header: 'parentname' },
    { field: 'parentemail', header: 'parentemail' },
    { field: 'parentphone', header: 'parentphone' },
    { field: 'enrollmentstatus', header: 'enrollmentstatus' },
    { field: '10', header: '10' },
    { field: '12', header: '12' },
  ];

  let uiSchema = {
    'ui:rootFieldId': 'myform',
    "ui:order": [
      "name", "rollno", "phone", "email", "batch", "personalemail", "gender", "residence", "address",
      "CGPA", "leetcode", "codechef", "hackerrank", "crcs", "dept", "parentname", "parentphone", "parentemail", "mentoremail",
      "spec", "skill", "yearofpassing", "school", "enrollmentstatus", "*"
    ],
    "ui:widget": "TextWidget",
    "ui:options": {
      "grid": {
        "container": "compact"
      }
    }
  };

  const addBulkStu = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    console.log(file);
    try {
      const response = await fetch(`${baseURL}/admin/addBulkStu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
        body: formData,
      });

      const res = await response.json();
      console.log(res);
      setJsonData(res);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const editStu = async ({ formData }, e) => {
    e.preventDefault();
    console.log(formData);
    const response = await fetch(`${baseURL}/admin/editStu`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stu: formData }),
    });

    const res = await response.json();
    if (res.success) toast.current.show({ severity: 'success', summary: 'Student Info updated', detail: formData.name, life: 3000 });
    fetchStudents();
    setShow(undefined)
  };

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
    setVisibleColumns(orderedSelectedColumns);
  };

  const header = <div className="d-flex justify-content-between align-items-center  gap-2">
    <FloatLabel className="mt-3"><MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} className="w-full sm:w-100rem" filter style={{ minWidth: "300px" }} display="chip" /> <label htmlFor="ms-cities">Select Columns</label></FloatLabel>
  </div>;

  useEffect(() => {
    let l = document.getElementById('myform');
    if (l) {
      l.classList.add('row');
    }
  }, []);

  const addStudent = async ({ formData }, e) => {
    //console.log('Data submitted: ', formData);
    const response = await fetch(`${baseURL}/admin/addSingleStu`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stu: formData }),
    });
    const res = await response.json()
    //console.log(res);
    fetchStudents();
  }

  const headerElement = (
    <div className="d-flex justify-content-between ">
      <span className="font-bold white-space-nowrap">Edit Student</span>
      <button onClick={e => { let q = stuLogDet.find(l => l.username == show.rollno); console.log(q); setShow1(q) }} className="btn btn-primary font-bold white-space-nowrap">Edit Student Login</button>
    </div>
  );

  async function fetchStuLogDet() {
    const response = await fetch(`${baseURL}/admin/getStuLogDet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stu: Object.keys(stu) }),
    });
    const res = await response.json()
    setStuLogDet(res.data.stu)
  }

  useEffect(() => {
    if (stu) fetchStuLogDet()
  }, [stu])

  const logschema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "username": {
        "type": "string",
        "pattern": "^[A-Za-z0-9_]+$"
      },
      "password": {
        "type": "string",
        "pattern": "^[a-f\\d]{32}$"
      },
      "deviceInfo": {
        "type": "string"
      },
    },
    "required": ["username", "password"]
  }

  async function editStudentLog({ formData }, e) {
    if (formData.deviceInfo === undefined) formData.deviceInfo = ''
    console.log(formData);
    const response = await fetch(`${baseURL}/admin/editStuLogDet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stu: formData }),
    });

    const res = await response.json();
  }

  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container w-100 bg-white rounded-3 p-3 '>
          <p className='fs-1 fw-bolder'>Student Management Portal</p>
          <form onSubmit={addBulkStu} className='border p-3 rounded-3 mb-3'>
            <div className="mb-3 d-flex column-gap-3 align-items-center">
              <label htmlFor="formFile" className="form-label">Upload file here to add students in bulk</label>
              <div className='flex-fill'>
                <input onChange={(e) => { setFile(e.target.files[0]) }} className="form-control" type="file" id="formFile" />
              </div>
              <Button type="submit" className="">Upload</Button>
            </div>
            <p className='fw-bold m-0 ' > <span className='text-danger'>use google sheets to prepare excel |</span>  <span className=' text-dark fw-bold m-0' > the format of date is dd-MM-yyyy hh:mm aa(14-06-2024 04:51 AM) | </span> <span className='text-danger fw-bold m-0' > Dont use any formulas to make excel </span></p>
          </form>
          <Accordion className='rounded-3 ' >
            <Accordion.Item eventKey={'0'}>
              <Accordion.Header> Add Student </Accordion.Header>
              <Accordion.Body >
                <Form className='row' schema={schema} validator={validator} uiSchema={uiSchema} onSubmit={addStudent} noValidate={true}>
                  <div>
                    <button className='mt-3 btn btn-primary' type='submit'>Submit</button>
                  </div>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      {stu && <div className='mt-3 container-fluid mb-3'>
        <p className='fs-3 fw-bold'>Batchs</p>
        <Toast ref={toast} />
        <Dialog className='d-flex container-fluid' closeOnEscape={true} header={headerElement} visible={show} maximizable style={{ width: '70vw' }} onHide={() => { setShow(false); }}>
          <Form className='row' schema={schema} validator={validator} uiSchema={uiSchema} onSubmit={editStu} noValidate={true} formData={show}>
            <div>
              <button className='mt-3 btn btn-primary' type='submit'>Submit</button>
            </div>
          </Form>
        </Dialog>

        <Dialog className='d-flex container-fluid' closeOnEscape={true} header="Edit Student Login Data" visible={show1} maximizable style={{ width: '70vw' }} onHide={() => { setShow1(undefined); }}>
          <Form className='row' schema={logschema} validator={validator} uiSchema={uiSchema} onSubmit={editStudentLog} noValidate={true} formData={show1}>
            <div>
              <button className='mt-3 btn btn-primary' type='submit'>Submit</button>
            </div>
          </Form>
        </Dialog>

        <Tooltip target=".export-buttons>button" position="bottom" />
        <Accordion alwaysOpen defaultActiveKey={year.curr}>
          <Accordion.Item eventKey={year.curr}>
            <Accordion.Header> {year.curr} batch - {Object.values(stu).length} students </Accordion.Header>
            <Accordion.Body >
              <DataTable ref={dt} reorderableColumns resizableColumns size='small' value={Object.values(stu)} showGridlines stripedRows paginator rows={20} rowsPerPageOptions={[30, 50, 100, 200]} tableStyle={{ minWidth: '50rem' }} filterDisplay="row" emptyMessage="No Students found." removableSort sortField="name" sortOrder={1} header={header}>
                <Column field="options" header=" " body={(data, props) => {
                  return <div> <div>  <button onClick={(event) => { setShow(data); }} style={{ backgroundColor: "#696747", color: "white" }} className="btn" >   <i className="bi bi-pencil-square"></i>  </button>   </div>  </div>
                }} />
                <Column field='name' header='Name' sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} />
                <Column field='rollno' header='Rollno' sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} />
                <Column field='phone' header='phone' sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} />
                <Column field='email' header='email' sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} />
                <Column field='CGPA' header='CGPA' sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} />
                <Column field='mentoremail' header='Mentor Email' sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} />
                <Column field='school' header='School' sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} />
                {/* OPTIONAL COL */}
                {visibleColumns.map((col) => (
                  <Column key={col.field} field={col.field} header={col.header} sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} />
                ))}
                {/* OPTIONAL COL */}

              </DataTable>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>}
    </div>
  );
}

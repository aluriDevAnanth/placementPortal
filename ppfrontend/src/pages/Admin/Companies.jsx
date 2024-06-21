import React, { useContext, useState, useEffect, useRef } from 'react';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AdminCon from '../../context/AdminPro'
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { parseISO, format } from 'date-fns'
import { Accordion, Button, Modal } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/antd';

const baseURL = process.env.BASE_URL

const ShortStu = ({ q, stus, students, ss }) => {
  const stu = q[ss] ? q[ss].map(rollno => students[rollno]) : [];

  //console.log(q, stus, students);

  return (
    <div>
      <DataTable size={'small'} value={stu} className="p-datatable-striped p-datatable-hover" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort filterDisplay="row" emptyMessage="No Company found." resizableColumns  >
        <Column field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains" />
        <Column field="rollno" header="rollno" filter sortable showFilterMenu={false} filterMatchMode="contains" />
        <Column field="email" header="email" filter sortable showFilterMenu={false} filterMatchMode="contains" />
      </DataTable>
    </div>
  );
};

function CompanyDetails({ comp, students, year, fetchComp }) {
  const { user, auth } = useContext(AuthCon);
  const toast = useRef(null);
  const [expandedRows, setExpandedRows] = useState();
  const [modalData, setModalData] = useState();

  const onRowExpand = (event) => {
    toast.current.show({ severity: 'info', summary: 'Info Expanded', detail: event.data.name, life: 3000 });
  };

  const onRowCollapse = (event) => {
    toast.current.show({ severity: 'success', summary: 'Info Collapsed', detail: event.data.name, life: 3000 });
  };

  const allowExpansion = (rowData) => {
    return comp;
  };

  const rowExpansionTemplate = (q) => {
    return (
      students && <ListGroup>
        <ListGroup.Item>Job Role: {q.jobRole}</ListGroup.Item>
        <ListGroup.Item>CTC: {q.CTC}</ListGroup.Item>
        <ListGroup.Item>category: {q.category}</ListGroup.Item>
        <ListGroup.Item>batch: {q.batch}</ListGroup.Item>
        <ListGroup.Item>Eligible: {q.eligibleStudents.length}</ListGroup.Item>
        <ListGroup.Item>Applied: {q.appliedStudents.length}</ListGroup.Item>
        <ListGroup.Item> Date Of Visit:  {q.dateOfVisit ? format(parseISO(q.dateOfVisit), 'dd-MM-yyyy') : ''}</ListGroup.Item>
        <ListGroup.Item>
          <Accordion>
            {["eligibleStudents", "appliedStudents", "shortlistedStudents"].map(ss => {
              return <Accordion.Item key={ss} eventKey={ss}>
                <Accordion.Header> {ss} - {Object.values(q[ss]).length} Students </Accordion.Header>
                <Accordion.Body>
                  <ShortStu ss={ss} stus={q[ss]} q={q} students={students} />
                </Accordion.Body>
              </Accordion.Item>
            })}
          </Accordion>
        </ListGroup.Item>
        <ListGroup.Item> Placed Students: {q.placedStudents && q.placedStudents.map((studentId, i) => {
          const student = students[studentId];
          return student ? <span key={i}>{student.name}, </span> : null;
        })} </ListGroup.Item>
        <ListGroup.Item>Mode Of Drive: {q.modeOfDrive}</ListGroup.Item>
        <ListGroup.Item>Status Of Drive: {q.statusOfDrive}</ListGroup.Item>
        <ListGroup.Item>
          <p className='fs-4 fw-3'>Stages</p>
          {students && Object.keys(q.stages).map((stageCategory, index) => (
            <Accordion key={index} alwaysOpen>
              <Accordion.Header> {stageCategory} - Total {!(q.stages[stageCategory] === 'not applicable') ? Object.values(q.stages[stageCategory]).filter(q => q === 'cleared').length : q.stages[stageCategory]} members </Accordion.Header>
              <Accordion.Body>
                <StageStuTable q={q} students={students} stageCategory={stageCategory} />
              </Accordion.Body>
            </Accordion>
          ))}
        </ListGroup.Item>
      </ListGroup>
    );
  };

  const schema = {
    "type": "object",
    "properties": {
      "10": { "type": "string" },
      "12": { "type": "string" },
      "name": { "type": "string" },
      "CTC": { "type": "string" },
      "jobRole": { "type": "string" },
      "jobLoc": { "type": "string" },
      "category": { "type": "string" },
      "batch": { "type": "string" },
      "driveStatus": { "type": "string" },
      "dateOfVisit": { "type": "string", "format": "date-time", "title": "Date of Visit" },
      "modeOfDrive": { "type": "string", "title": "Mode Of Drive" },
      "jobDes": { "type": "string" },
      "CGPA": { "type": "string" },
      "branches": { "title": "Eligibility Branches", "type": "array", "items": { "type": "string" } }
    },
    "required": ["10", "12", "name", "CTC", "jobRole", "jobLoc", "category", "batch", "driveStatus", "dateOfVisit", "modeOfDrive", "jobDes", "CGPA", "branches"]
  }

  const uiSchema = {
    "jobDes": {
      "ui:widget": "textarea", "rows": 15,
    },
    "ui:order": [
      "name",
      "jobRole",
      "jobDes",
      "jobLoc",
      "category",
      "batch",
      "driveStatus",
      "dateOfVisit",
      "modeOfDrive",
      "CTC",
      "branches",
      "CGPA",
      "10",
      "12",
    ],
  }

  async function editComp({ formData }, e) {
    e.preventDefault;
    const response = await fetch(`${baseURL}/admin/editComp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comp: formData }),
    });
    const res = await response.json()
    // console.log(res);
    fetchComp();
    setModalData(undefined)
  }

  return (
    user !== null && (
      <div className="bodyBG">
        <Modal size="lg" show={modalData} onHide={() => setModalData(undefined)}     >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg"> Edit Companies </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className='row' schema={schema} validator={validator} uiSchema={uiSchema} formData={modalData} onSubmit={editComp} noValidate={true}>
              <div>
                <button className='mt-3 btn btn-primary' type='submit'>Submit</button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <div className="container-fluid">
          <div className="d-flex">
            <div className="flex-fill rounded-3 ms-3 border-primary me-3">
              <Toast ref={toast} />
              <DataTable size={'small'} value={comp} className="p-datatable-striped p-datatable-hover" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort filterDisplay="row" emptyMessage="No Company found." expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}>
                <Column expander={allowExpansion} style={{ width: '2rem' }} />
                <Column field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="dateOfVisit" header="Date Of Visit" filter sortable showFilterMenu={false} filterMatchMode="contains" body={(data, props) => { return <p> {format(parseISO(data.dateOfVisit), 'dd-MM-yyyy')}</p> }} />
                <Column field="modeOfDrive" header="Mode Of Drive" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="CTC" header="CTC" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="eligible" header="Eligible" filter sortable showFilterMenu={false} filterMatchMode="contains"
                  body={(data, props) => { return <p> {data.eligibleStudents.length}</p> }} />
                <Column field="applied" header="Applied" filter sortable showFilterMenu={false} filterMatchMode="contains"
                  body={(data, props) => { return <p> {data.appliedStudents.length}</p> }} />
                <Column field="shortlisted" header="Short Listed" filter sortable showFilterMenu={false} filterMatchMode="contains"
                  body={(data, props) => { return <p> {data.shortlistedStudents.length}</p> }} />
                {["onlineTest", "GD", "interview1", "HR", "otherStages"].map((col, i) => (
                  <Column key={col} field={col} header={col} filter sortable showFilterMenu={false} filterMatchMode="contains" body={(data, props) => {
                    if (!data.stages || !data.stages[col]) return <p>not applicable</p>;
                    return (<p>  {data.stages[col] !== 'not applicable' ? Object.values(data.stages[col]).filter(status => status === 'cleared').length : data.stages[col]} </p>);
                  }} />))}
                <Column field="placedStudents" header="Final selected" filter sortable showFilterMenu={false} filterMatchMode="contains" body={(data, props) => { return <p> {data.placedStudents ? data.placedStudents.length : '-'}</p> }} />
                <Column field="options" header="" body={(data, props) => {
                  return <div> <div>  <button onClick={(event) => { setModalData(data); }} style={{ backgroundColor: "#696747", color: "white" }} className="btn" >   <i className="bi bi-pencil-square"></i>  </button>   </div>  </div>
                }} />
              </DataTable>
            </div>
          </div>
        </div>
      </div >
    )
  );
}

const StageStuTable = ({ q, students, stageCategory }) => {
  const data = Object.keys(q.stages[stageCategory]).map(rollNo => {
    const student = students[rollNo];
    return student ? {
      name: student.name,
      rollno: student.rollno,
      email: student.email,
      status: q.stages[stageCategory][rollNo]
    } : null;
  }).filter(item => item !== null);

  return (
    <DataTable value={data} showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort filterDisplay="row" emptyMessage="No Students found." resizableColumns reorderableColumns  >
      <Column className='text-center' field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains" />
      <Column className='text-center' field="rollno" header="Roll No" filter sortable showFilterMenu={false} filterMatchMode="contains" />
      <Column className='text-center' field="email" header="Email" filter sortable showFilterMenu={false} filterMatchMode="contains" />
      <Column className='text-center' field="status" header="Status" filter sortable showFilterMenu={false} filterMatchMode="contains" />
    </DataTable>
  );
};


export default function Companies() {
  const { auth } = useContext(AuthCon);
  const [file, setFile] = useState(null);
  const { stu, year, comp, fetchComp } = useContext(AdminCon)
  const toast = useRef(null);
  const [date, setDate] = useState('');

  const schema = {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "10": { "type": "string" },
      "12": { "type": "string" },
      "CTC": { "type": "string" },
      "jobRole": { "type": "string" },
      "jobLoc": { "type": "string" },
      "category": { "type": "string" },
      "batch": { "type": "string" },
      "driveStatus": { "type": "string" },
      "dateOfVisit": { "type": "string", "format": "date", "title": "Date of Visit" },
      "modeOfDrive": { "type": "string", "title": "Mode Of Drive" },
      "jobDes": { "type": "string" },
      "CGPA": { "type": "string" },
      "branches": { "title": "Eligibility Branches", "type": "array", "items": { "type": "string" } }
    },
    "required": ["10", "12", "name", "CTC", "jobRole", "jobLoc", "category", "batch", "driveStatus", "dateOfVisit", "modeOfDrive", "jobDes", "CGPA", "branches"]
  }

  const uiSchema = {
    "ui:classNames": "mb-3",
    'ui:globalOptions': { copyable: true },
    'ui:rootFieldId': 'gap-0 m-0',
    "jobDes": { "ui:widget": "textarea", "rows": 15, },
    "ui:order": ["name", "jobRole", "jobDes", "jobLoc", "category", "batch", "driveStatus", "dateOfVisit", "modeOfDrive",
      "CTC", "branches", "CGPA", "10", "12",],
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const addCompBulk = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('date', date);
    console.log(formData);
    try {
      const response = await fetch(`${baseURL}/admin/addCompBulk`, {
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
      console.log(res.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  async function addComp({ formData }, e) {
    console.log('Data submitted: ', formData);
    const response = await fetch(`${baseURL}/admin/addSingleComp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comp: formData }),
    });
    const res = await response.json()
    //console.log(res);
    fetchComp();
  }

  useEffect(() => {
    let l = document.getElementById('myform');
    if (l) {
      l.classList.add('row');
    }
  }, []);

  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container w-100 bg-white  p-3 shadow rounded-4'>
          <p className='fs-1 fw-bolder'>Companies Management Portal</p>
          <form className='border border-2 p-3 mb-3 rounded-3 d-flex flex-column gap-3' onSubmit={addCompBulk}>
            <div className="d-flex gap-0 column-gap-3 align-items-content">
              <label htmlFor="formFile" className="form-label align-items-center mt-2">Upload file here to add Companies in bulk</label>
              <div className='flex-fill my-auto m-0'><input required className="form-control" type="file" id="formFile" onChange={handleFileChange} accept=".xlsx, .xls" /></div>
              <div><Button type="submit" className="">Upload</Button></div>
            </div>
            <p className='fw-bold m-0'>Warnings: <span className='fw-bold m-0'>Don't use any formulas to make excel</span></p>
          </form>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header> Add Companies </Accordion.Header>
              <Accordion.Body>
                <Form showErrorList={false} schema={schema} uiSchema={uiSchema} validator={validator} onSubmit={addComp} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

        </div>
      </div>
      {
        stu && comp && <div className='mt-3 container-fluid'>
          <p className='fs-3 fw-bold ms-4'>Companies</p>
          <Toast ref={toast} />
          <Tooltip target=".export-buttons>button" position="bottom" />
          <CompanyDetails fetchComp={fetchComp} comp={comp} students={stu} year={year} />
        </div>
      }
    </div >
  );
}

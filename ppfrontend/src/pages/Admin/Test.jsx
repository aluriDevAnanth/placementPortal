import React, { useContext, useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';
import AdminCon from '../../context/AdminPro'
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Form as BForm } from 'react-bootstrap';
import { format, parseISO } from 'date-fns'
import Modal from 'react-bootstrap/Modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import Accordion from 'react-bootstrap/Accordion';

const baseURL = process.env.BASE_URL

function AddTestForm({ tests, fetchTests }) {
  const { auth } = useContext(AuthCon);

  let schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
      },
      "date": {
        "type": "string",
        "format": "date-time"
      },
      "marks": {
        "type": "object",
        "additionalProperties": {
          "type": "object",
          "properties": {
            "aptitude": {
              "type": ["string", "number"]
            },
            "coding": {
              "type": ["string", "number"]
            },
            "others": {
              "type": ["string", "number"]
            },
            "att": {
              "type": "string",
              "enum": ["present", "absent"]
            }
          },
          "required": ["aptitude", "coding", "others", "att"]
        }
      },
      "batch": {
        "type": "string",
        "pattern": "^\\d{4}$"
      }
    },
    "required": ["name", "date", "marks", "batch"]
  }


  async function addComp({ formData }, e) {
    formData.students = {}
    Object.keys(formData.marks).map(r => {
      formData.students[r] = formData.marks[r].att
      delete formData.marks[r].att;
    })
    console.log(formData);
    const response = await fetch(`${baseURL}/admin/addSingleTest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: formData }),
    });
    const res = await response.json()
    console.log(res);
    fetchTests();
  }

  return <>
    <Accordion >
      <Accordion.Item eventKey="0">
        <Accordion.Header>Add Tests  </Accordion.Header>
        <Accordion.Body>
          <Form schema={schema} validator={validator} onSubmit={addComp} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}

export default function Test() {
  const { auth } = useContext(AuthCon);
  const [file, setFile] = useState(null);
  const [sfile, setSFile] = useState(null);
  const [bfile, setBFile] = useState(null);
  const [tests, setTests] = useState();
  const { stu, year, setStu } = useContext(AdminCon)
  const toast = useRef(null);

  const [curr, setCurr] = useState({ show: false, data: {} });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${baseURL}/admin/addTestMarks`, {
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
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  async function fetchTests() {
    const response = await fetch(`${baseURL}/admin/getTests/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json()
    //console.log(res);
    setTests(res.data.tests)
  }

  async function addTest(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let q = {};

    const name = formData.get('name');
    const date = formData.get('date');
    let batch = year.curr;
    q.sFile = sfile;
    let eventData, students;

    if (sfile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        const rows = text.split('\n');

        students = rows.map((row) => {
          const a = row.split(',');
          return a[0] !== 'rollno' ? a[0] : null;
        }).filter((student) => student !== null);

        students = students.filter(q => { return q !== '' })
        eventData = { name, batch, date, students };
        //console.log(eventData);

        const response = await fetch(`${baseURL}/admin/postTest`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`,
          },
          body: JSON.stringify({ data: eventData }),
        });

        const res = await response.json();

        //console.log(res)
        fetchTests();
      };

      reader.readAsText(sfile);
    } else {
      eventData = { name, batch, date };

      const response = await fetch(`${baseURL}/admin/postTest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify({ data: eventData }),
      });

      const res = await response.json();

      //console.log(res)
      fetchTests();
    }
  }

  async function editTest(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let q = {};

    const name = formData.get('name');
    const date = formData.get('date');
    let batch = year.curr;
    q.sFile = sfile;
    let eventData, students;

    if (sfile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        const rows = text.split('\n');

        students = rows.map((row) => {
          const a = row.split(',');
          return a[0] !== 'rollno' ? a[0] : null;
        }).filter((student) => student !== null);

        students = students.filter(q => { return q !== '' })
        eventData = { name, batch, date, students };
        //console.log(eventData);

        const response = await fetch(`${baseURL}/admin/putTest`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`,
          },
          body: JSON.stringify({ data: eventData }),
        });

        const res = await response.json();

        //console.log(res)
        fetchTests();
      };

      reader.readAsText(sfile);
    } else {
      eventData = { name, batch, date };

      const response = await fetch(`${baseURL}/admin/putTest`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify({ data: eventData }),
      });

      const res = await response.json();

      //console.log(res)
      fetchTests();
      setCurr({ show: false, data: {} })
    }
  }

  useEffect(() => {
    if (year?.curr) fetchTests()
  }, [year?.curr])

  const actionTemplate = (rowData) => {
    return (
      <div className="d-flex gap-2 justify-content-center">
        <Link to={`/test/${rowData._id}`} style={{ backgroundColor: "#696747", color: "white" }} className="btn me-2">Details</Link>
        <button label="Edit" className="btn" style={{ backgroundColor: "#696747", color: "white" }} onClick={() => { setCurr({ show: true, data: rowData }) }} >Edit</button>
      </div >
    );
  };

  async function addBulkTest(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', bfile);

    try {
      const response = await fetch(`${baseURL}/admin/addBulkTests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
        body: formData,
      });

      const res = await response.json();
      //console.log(res);
      fetchTests()
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container w-100'>
          <p className='fs-1 fw-bolder'>Test Management Portal</p>
          {tests && <div className='mb-3 border  shadow p-3 bg-white rounded-4'>
            <p className='fs-4 fw-bold'>Add Tests</p>
            <AddTestForm tests={tests} fetchTests={fetchTests} />
          </div>}

          <div className='mb-3 border  shadow p-3 bg-white rounded-4'>
            <p className='fs-4 fw-bold'>Add Bulk Tests</p>
            <BForm onSubmit={addBulkTest} className='w-100'>
              <BForm.Group controlId="formFile" className="mb-3 d-flex align-items-center gap-3">
                <BForm.Label className='flex-fill'>Add file to add Bulk Tests</BForm.Label>
                <div className='w-100'>
                  <BForm.Control type="file" onChange={(e) => { setBFile(e.target.files[0]); }} />
                </div>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </BForm.Group>
            </BForm>
            <p className='fw-bold m-0' > <span className='text-danger'>use google sheets to prepare excel |</span>  <span className=' text-dark fw-bold m-0' > the format of date is dd-MM-yyyy hh:mm aa(14-06-2024 04:51 AM) | </span> <span className='text-danger fw-bold m-0' > Dont use any formulas to make excel </span></p>
          </div>

          <div className='mb-3 border  shadow p-3 bg-white rounded-4'>
            <DataTable value={tests} paginator rows={10} className="p-datatable-striped" rowsPerPageOptions={[25, 50]} showGridlines stripedRows filterDisplay="row" emptyMessage="No Test found." removableSort >
              <Column filter showFilterMenu={false} filterMatchMode="contains" field="name" header="Name" sortable className="text-center" />
              <Column filter showFilterMenu={false} filterMatchMode="contains" field="date" header="Date" sortable className="text-center" body={(rowData) => format(parseISO(rowData.date), 'dd-MM-yyyy hh:mm a')} />
              <Column filter showFilterMenu={false} filterMatchMode="contains" field="Object.keys(students).length" header="Number of students" sortable className="text-center" body={(data) => { return <p>{Object.keys(data.students).length}</p> }} />
              <Column body={actionTemplate} header="Options" className="text-center" />
            </DataTable>
          </div>
          <div>
            <Toast ref={toast} />
          </div>
        </div>
      </div>
      {stu && <div className='mt-3 container-fluid'>
        <Toast ref={toast} />
        <Tooltip target=".export-buttons>button" position="bottom" />
      </div>}
      <Modal size="lg" show={curr.show} onHide={() => setCurr({ show: false, data: {} })}    >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">   Edit Test '{curr.data.name}'   </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BForm onSubmit={editTest} className='w-100'>
            <div className='d-flex w-100 gap-3' style={{ width: "100%" }}>
              <FloatingLabel controlId="floatingInput" label="Name of test" className="mb-3 w-100"  >
                <BForm.Control defaultValue={curr.data.name} name='name' required type="text" placeholder="name@example.com" />
              </FloatingLabel>
              <FloatingLabel controlId="floatingInput" label="Select date of test" className="mb-3 w-100">
                <BForm.Control defaultValue={curr.data.date ? new Date(curr.data.date).toISOString().slice(0, 16) : ''} name='date' required type="datetime-local" placeholder="name@example.com" />
              </FloatingLabel>
            </div>
            <BForm.Group controlId="formFile" className="mb-3 d-flex align-items-center gap-3">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </BForm.Group>
          </BForm>
        </Modal.Body>
      </Modal>
    </div>
  );
}

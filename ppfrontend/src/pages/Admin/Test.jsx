import React, { useContext, useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';
import AdminCon from '../../context/AdminPro'
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { format, parseISO } from 'date-fns'
import Modal from 'react-bootstrap/Modal';

export default function Test() {
  const { auth } = useContext(AuthCon);
  const [file, setFile] = useState(null);
  const [sfile, setSFile] = useState(null);
  const [tests, setTests] = useState();
  const { stu, year, setStu } = useContext(AdminCon)
  const toast = useRef(null);
  const baseURL = process.env.BASE_URL
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
      /* jsonData.map(q => {
        toast.current.show({ severity: 'info', summary: 'Attendence added', detail: `${q.rollno.length} students attendence added to ${q.name} for date ${q.date}`, life: 3000 });
      }) */
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
        console.log(eventData);

        const response = await fetch(`${baseURL}/admin/postTest`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`,
          },
          body: JSON.stringify({ data: eventData }),
        });

        const res = await response.json();

        console.log(res)
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

      console.log(res)
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
        console.log(eventData);

        const response = await fetch(`${baseURL}/admin/putTest`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`,
          },
          body: JSON.stringify({ data: eventData }),
        });

        const res = await response.json();

        console.log(res)
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

      console.log(res)
      fetchTests();
    }
  }

  useEffect(() => {
    if (year.curr) fetchTests()
  }, [year.curr])

  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container w-100'>
          <p className='fs-1 fw-bolder'>Test Management Portal</p>
          <div className='mb-3 border  shadow p-3 bg-white rounded-4'>
            <p className='fs-4 fw-bold'>Add Tests</p>
            <Form onSubmit={addTest} className='w-100'>
              <div className='d-flex w-100 gap-3' style={{ width: "100%" }}>
                <FloatingLabel controlId="floatingInput" label="Name of test" className="mb-3 w-100"  >
                  <Form.Control name='name' required type="text" placeholder="name@example.com" />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput" label="Select date of test" className="mb-3 w-100"  >
                  <Form.Control name='date' required type="datetime-local" placeholder="name@example.com" />
                </FloatingLabel>
              </div>
              <Form.Group controlId="formFile" className="mb-3 d-flex align-items-center gap-3">
                <Form.Label className='flex-fill'>Add file to add student for this test</Form.Label>
                <div className='w-100'>
                  <Form.Control type="file" onChange={(e) => { setSFile(e.target.files[0]); }} />
                </div>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </div>

          <div className='mb-3 border  shadow p-3 bg-white rounded-4'>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 d-flex column-gap-3 align-items-center">
                <label htmlFor="formFile" className="form-label">Upload file here to add students</label>
                <div className='flex-fill'>
                  <input className="form-control" type="file" id="formFile" onChange={handleFileChange} accept=".xlsx, .xls" />
                </div>
                <Button type="submit" className="">Upload</Button>
              </div>
            </form>
          </div>

          <div className='mb-3 border  shadow p-3 bg-white rounded-4'>
            <Table striped bordered hover>
              <thead>
                <tr className='text-center'>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Number of students</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {tests && tests.map((t, i) => {
                  return <tr key={i} className='text-center'>
                    <th>{t.name}</th>
                    <th>{format(parseISO(t.date), 'dd-MM-yyyy hh:mm a')}</th>
                    <th>{t.students.length}</th>
                    <th className='d-flex gap-2 justify-content-center'>
                      <button className='btn text-white fw-bold' style={{ backgroundColor: "#696747" }}  >Options</button>
                      <button className='btn text-white fw-bold' style={{ backgroundColor: "#696747" }} onClick={() => { setCurr({ show: true, data: t }) }}>Edit</button>
                    </th>
                  </tr>
                })}
              </tbody>
            </Table>
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
          {console.log(curr.data)}
          <Modal.Title id="example-modal-sizes-title-lg">   Edit Test '{curr.data.name}'   </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editTest} className='w-100'>
            <div className='d-flex w-100 gap-3' style={{ width: "100%" }}>
              <FloatingLabel controlId="floatingInput" label="Name of test" className="mb-3 w-100"  >
                <Form.Control defaultValue={curr.data.name} name='name' required type="text" placeholder="name@example.com" />
              </FloatingLabel>
              <FloatingLabel controlId="floatingInput" label="Select date of test" className="mb-3 w-100">
                <Form.Control defaultValue={curr.data.date ? new Date(curr.data.date).toISOString().slice(0, 16) : ''} name='date' required type="datetime-local" placeholder="name@example.com" />
              </FloatingLabel>

            </div>
            <Form.Group controlId="formFile" className="mb-3 d-flex align-items-center gap-3">
              <Form.Label className='flex-fill'>Add file to add student for this test</Form.Label>
              <div className='w-100'>
                <Form.Control type="file" onChange={(e) => { setSFile(e.target.files[0]); }} />
              </div>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

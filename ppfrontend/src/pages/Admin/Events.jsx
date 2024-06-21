import React, { useContext, useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';
import SetEvent from './SetEvent';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
const baseURL = process.env.BASE_URL
import Accordion from 'react-bootstrap/Accordion';
import Fade from 'react-bootstrap/Fade';

function EventTable({ events, setCurr, handleShow, deleteEvent }) {
  const formatDate = (date) => format(parseISO(date), "dd-MM-yyyy hh:mm aa");
  console.log(events);
  const actionBodyTemplate = (rowData) => (
    <div className='p-2'>
      <button onClick={() => { setCurr(rowData); console.log(rowData); handleShow(); }} className="btn btn-info me-2">Edit</button>
      {!rowData.isExp ? (
        <Link to={`/currevent/${rowData._id}`} className="btn btn-secondary me-2">Details</Link>
      ) : (
        <span className="btn btn-secondary me-2 disabled">Details</span>
      )}
      <button type="button" onClick={() => deleteEvent(rowData.name, rowData._id)} className="btn btn-danger">
        <FaRegTrashAlt />
      </button>
    </div>
  );

  const statusBodyTemplate = (rowData) => (
    <div>
      {rowData.isExp && <span className="badge bg-danger text-white">Expired</span>}
      {rowData.isHap && <span className="badge bg-success text-white">Happening Now</span>}
    </div>
  );

  return (events.length > 0 &&
    <DataTable value={events} reorderableColumns resizableColumns size='small' showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[20, 30, 50, 70, 100]} tableStyle={{ minWidth: '50rem' }} filterDisplay="row" emptyMessage="No Events found." removableSort >
      <Column field="name" header="Name" className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} />
      <Column field="des" header="Description" className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} />
      <Column field="startTime" header="Start Time" body={(rowData) => formatDate(rowData.startTime)} className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} />
      <Column field="endTime" header="End Time" body={(rowData) => formatDate(rowData.endTime)} className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} />
      <Column field="rec" header="Rec" className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} />
      <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} />
      <Column field="students" header="Students" body={(rowData) => rowData.students.length} className="text-center" sortable filter filterMatchMode="contains" showFilterMenu={false} />
      <Column header="Actions" body={actionBodyTemplate} />
    </DataTable>
  );
}

export default function Events() {
  const { auth } = useContext(AuthCon);
  const [events, setEvents] = useState([]);
  const [curr, setCurr] = useState()
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const EventSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    des: Yup.string().required('Description is required'),
    startTime: Yup.date().required('Start time is required'),
    endTime: Yup.date().required('End time is required'),
    rec: Yup.string().required('Recurrence is required'),
  });

  async function fetchEvents() {
    const response = await fetch(`${baseURL}/admin/getEvents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    console.log(res);
    setEvents(res.data || []);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function deleteEvent(name, id) {
    if (confirm(`Do you want to delete the event ${name}`) == true) {
      await fetch(`${baseURL}/admin/deleteEvent/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      setEvents(events.filter(event => event._id !== id));
    }
  }

  const editEvent = async (values) => {
    const { name, des, startTime, endTime, rec, file } = values;
    console.log(name, des, startTime, endTime, rec);

    let eventData = { name, des, startTime, endTime, rec };

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const text = event.target.result;
        const rows = text.split('\n');

        const students = rows
          .map((row) => {
            const a = row.split(',');
            return a[0] && a[0].trim() !== 'rollno' ? a[0].trim() : null;
          })
          .filter((student) => student !== null);

        console.log('Parsed Students:', students);

        eventData = { ...eventData, students };

        const response = await fetch(`${baseURL}/admin/putEvent`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
          },
          body: JSON.stringify({ data: { _id: curr._id, ...eventData } }),
        });

        const res = await response.json();
        console.log(res);
        fetchEvents();
        handleClose();
      };

      reader.readAsText(file);
    } else {
      const response = await fetch(`${baseURL}/admin/putEvent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,
        },
        body: JSON.stringify({ data: { _id: curr._id, ...eventData } }),
      });

      const res = await response.json();
      console.log(res);
      fetchEvents();
      handleClose();
    }
  };


  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 w-100'>
          <div className='d-flex flex-column'>
            <div className='mb-3'>
              <Button onClick={() => setOpen(!open)} aria-controls="example-fade-text" aria-expanded={open}   >
                Add Event
              </Button>
            </div>
            <Fade in={open}>
              <div id="example-fade-text">
                <SetEvent setOpen={setOpen} fetchEvents={fetchEvents} />
              </div>
            </Fade>
          </div>
        </div>
      </div>
      <div className='container-fluid mt-4'>
        {curr && <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                name: curr.name || '', des: curr.des || '', startTime: curr.startTime || '',
                endTime: curr.endTime || '', rec: curr.rec || '', file: null
              }}
              validationSchema={EventSchema}
              onSubmit={(values, { setSubmitting }) => {
                editEvent(values);
                fetchEvents();
                handleClose();
                setSubmitting(false);
              }}
            >
              {({ setFieldValue }) => (
                <Form className=''>
                  <div className='d-flex gap-3'>
                    <div className="form-floating col mb-3">
                      <Field name="name" type="text" className="form-control" />
                      <label htmlFor="name">Name</label>
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </div>
                    <div className="form-floating col mb-3">
                      <Field name="des" as="textarea" className="form-control" />
                      <label htmlFor="des">Description</label>
                      <ErrorMessage name="des" component="div" className="text-danger" />
                    </div>
                  </div>
                  <div className='d-flex gap-3'>
                    <div className="form-floating col mb-3">
                      <Field name="startTime" type="datetime-local" className="form-control" />
                      <label htmlFor="startTime">Start Time</label>
                      <ErrorMessage name="startTime" component="div" className="text-danger" />
                    </div>
                    <div className="form-floating col mb-3">
                      <Field name="endTime" type="datetime-local" className="form-control" />
                      <label htmlFor="endTime">End Time</label>
                      <ErrorMessage name="endTime" component="div" className="text-danger" />
                    </div>
                  </div>
                  <div className='d-flex gap-5'>
                    <div>
                      <Field as="select" name="rec" className='form-select col' style={{ width: '25rem' }}>
                        <option value="" disabled>Select interval</option>
                        <option value="weekly">Once a Week</option>
                        <option value="daily">Once a day</option>
                        <option value="once">One Time</option>
                      </Field>
                      <ErrorMessage name="rec" component="div" className="text-danger" />
                    </div>
                    <div className='col'>
                      <input
                        className='form-control'
                        type="file"
                        name="file"
                        onChange={(event) => {
                          setFieldValue("file", event.currentTarget.files[0]);
                        }}
                      />
                      <ErrorMessage name="file" component="div" className="text-danger" />
                    </div>
                  </div>
                  <Button className='mt-3' variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>}
        <p className='fs-3 fw-bolder'>Current Events</p>
        <EventTable events={events} setCurr={setCurr} handleShow={handleShow} deleteEvent={deleteEvent} />
      </div>
    </div>
  );
}

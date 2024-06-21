import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format, isAfter } from 'date-fns';
import AuthCon from '../../context/AuthPro';
import Spinner from 'react-bootstrap/Spinner';

export default function SetEvent({ fetchEvents, setOpen }) {
  const [eventInfo, setEventInfo] = useState(null);
  const [sfile, setSFile] = useState(null);
  const { auth } = useContext(AuthCon);
  const baseURL = process.env.BASE_URL;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    startTime: Yup.date()
      .required('Start time is required')
      .test(
        'startTimeLessThanEndTime',
        'Start time must be before end time',
        (value, { parent }) => {
          if (!parent.endTime) return true;
          return isAfter(new Date(parent.endTime), new Date(value));
        }
      ),
    endTime: Yup.date()
      .required('End time is required')
      .test(
        'endTimeGreaterThanStartTime',
        'End time must be after start time',
        (value, { parent }) => {
          if (!parent.startTime) return true;
          return isAfter(new Date(value), new Date(parent.startTime));
        }
      ),
    recurrence: Yup.string().required('Recurrence is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    const { name, description, recurrence, endTime, startTime } = values;
    const file = sfile;

    try {
      if (file) {
        const reader = new FileReader();

        reader.onload = async (event) => {
          const text = event.target.result;
          const rows = text.split('\n');
          const students = rows
            .map((row) => row.split(',')[0])
            .filter((student) => student !== 'rollno' && student.trim() !== '');

          const eventDataWithFile = {
            name,
            des: description,
            rec: recurrence, endTime, startTime,
            students,
          };
          console.log(eventDataWithFile);
          try {
            const response = await fetch(`${baseURL}/admin/postEvent`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${auth}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ data: eventDataWithFile }),
            });

            if (response.ok) {
              const res = await response.json();
              console.log('Event posted successfully:', res);
              fetchEvents();
            } else {
              console.error('Failed to post event');
            }
          } catch (error) {
            console.error('Error posting event:', error);
          } finally {
            setOpen(false);
            setSubmitting(false);
            resetForm();
          }
        };

        reader.readAsText(file);
      } else {
        const eventDataWithoutFile = {
          name,
          description, endTime, startTime,
          rec: recurrence,
        };

        try {
          const response = await fetch(`${baseURL}/admin/postEvent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth}`,
            },
            body: JSON.stringify({ data: eventDataWithoutFile }),
          });

          if (response.ok) {
            const res = await response.json();
            console.log('Event posted successfully:', res);
            fetchEvents();
          } else {
            console.error('Failed to post event');
          }
        } catch (error) {
          console.error('Error posting event:', error);
        } finally {
          setOpen(false);
          setSubmitting(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      setSubmitting(false);
    }
  };



  return (
    <Formik
      initialValues={{ name: '', description: '', startTime: '', endTime: '', recurrence: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <div className='ms-3 me-3 container w-100'>
            <div className='d-flex gap-3'>
              <div className="form-floating col mb-3">
                <Field type="text" name="name" id="name" placeholder="Name" className="form-control" />
                <label htmlFor="name">Name</label>
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>
              <div className="form-floating col mb-3">
                <Field as="textarea" style={{ minHeight: "250px" }} type="text" name="description" id="description" placeholder="Description" className="form-control" />
                <label htmlFor="description">Description</label>
                <ErrorMessage name="description" component="div" className="text-danger" />
              </div>
            </div>
            <div className='d-flex gap-3'>
              <div className="form-floating col mb-3">
                <Field type="datetime-local" name="startTime" id="startTime" placeholder="Start Time" className="form-control" />
                <label htmlFor="startTime">Start Time</label>
                <ErrorMessage name="startTime" component="div" className="text-danger" />
              </div>
              <div className="form-floating col mb-3">
                <Field type="datetime-local" name="endTime" id="endTime" placeholder="End Time" className="form-control" />
                <label htmlFor="endTime">End Time</label>
                <ErrorMessage name="endTime" component="div" className="text-danger" />
              </div>
            </div>
            <div className='d-flex gap-5'>
              <div className='col'>
                <Field as="select" name="recurrence" id="recurrence" className="form-select col">
                  <option value="" disabled>Select interval</option>
                  <option value="weekly">Once a Week</option>
                  <option value="daily">Once a day</option>
                  <option value="once">One Time</option>
                </Field>
                <ErrorMessage name="recurrence" component="div" className="text-danger" />
              </div>
              <div className='col'>
                <input onChange={(e) => { setSFile(e.target.files[0]); }} className="form-control" type="file" name="file" />
                <ErrorMessage name="file" component="div" className="text-danger" />
              </div>
              <div className='col'>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner> : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

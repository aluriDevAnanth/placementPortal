import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Formik, Field, ErrorMessage } from 'formik';
import { useForm, Controller } from 'react-hook-form';
import AuthCon from '../../../context/AuthPro';
import * as Yup from 'yup';
import { FloatingLabel, Form as BootstrapForm, Table } from 'react-bootstrap';

export default function AddFeed({ curr, comp }) {

  const initialValues = {
    companyId: '',
    uploadedDate: '',
    studentFeedback: ''
  };

  const validationSchema = Yup.object().shape({
    companyId: Yup.string().required('Company name is required'),
    uploadedDate: Yup.string().required('Uploaded date is required'),
    studentFeedback: Yup.string().required('Student feedback is required')
  });

  async function addFeed(values, setSubmitting) {
    console.log(values);
    const response = await fetch(`http://localhost:3000/api/student/postStuFeed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ values }),
    });
    const res = await response.json();
    await fetchStuFeedDetails();
    setSubmitting(false);
  }

  async function editFeed(values, setSubmitting) {
    console.log(values);
    /* const response = await fetch(`http://localhost:3000/api/student/postStuFeed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ values }),
    });
    const res = await response.json();
    await fetchStuFeedDetails();
    setSubmitting(false); */
  }

  const onSubmit = async (values, { setSubmitting }) => {
    if (!curr) {
      addFeed(values, setSubmitting);
    } else {
      editFeed(values, setSubmitting);
    }
  };

  return (
    <Formik initialValues={curr ? curr : initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
      {props => (
        <BootstrapForm onSubmit={props.handleSubmit} className='d-flex flex-column gap-3 '>
          <div className='d-flex gap-3'>
            {curr && console.log('aa', props)}
            <FloatingLabel className='col' controlId="floatingSelect" label="Works with selects">
              <BootstrapForm.Select as="select" {...props.getFieldProps('companyId')} aria-label="Floating label select example">
                <option value="" disabled  >Open this select menu to select company</option>
                {comp.map((q, i) => {
                  return <option key={i} value={q._id}>{q.name}</option>
                })}
              </BootstrapForm.Select>
              <ErrorMessage name="companyId" component="div" className="text-danger" />
            </FloatingLabel>
            <div className='col'>
              <FloatingLabel controlId="floatingDate" label="Uploaded Date">
                <Field className='form-control' type="datetime-local" name="uploadedDate" />
                <ErrorMessage name="uploadedDate" component="div" className="text-danger" />
              </FloatingLabel>
            </div>
          </div>
          <Field name="studentFeedback">
            {({ field }) => (
              <div>
                <FloatingLabel controlId="floatingInput" label="Student Feedback" className=" " >
                  <textarea rows="4" className='form-control' {...field} type="textarea" />
                  <ErrorMessage name="studentFeedback" component="div" className="text-danger" />
                </FloatingLabel>
              </div>
            )}
          </Field>
          <div>
            <button className="btn btn-primary" type="submit" disabled={props.isSubmitting}>Submit</button>
          </div>
        </BootstrapForm>
      )}
    </Formik>
  )
}

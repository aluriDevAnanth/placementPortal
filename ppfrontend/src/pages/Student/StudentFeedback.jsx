import React, { useContext, useEffect, useState } from 'react';
import { isAfter, addDays, parseISO, format } from 'date-fns';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import Table from 'react-bootstrap/Table';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function StudentFeedback() {
  const { auth, user } = useContext(AuthCon);
  const [comp, setComp] = useState(null);
  const [feed, setFeed] = useState([]);
  const [curr, setCurr] = useState(null);

  const initialValues = {
    studentFeedback: ''
  };

  const validationSchema = Yup.object().shape({
    studentFeedback: Yup.string().required('Feedback is required')
  });

  useEffect(() => {
    if (auth) {
      fetchStuFeedDetails();
    }
  }, [auth]);

  async function fetchStuFeedDetails() {
    try {
      const response = await fetch(`http://localhost:3000/api/student/getFeedbackPageDetails`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      setComp(res.data.placeCom);
      setFeed(res.data.studentfeedback);
    } catch (error) {
      console.error('Error fetching student feedback details:', error);
    }
  }

  async function submitForm(values) {
    try {
      const url = curr
        ? `http://localhost:3000/api/student/updateStuFeed`
        : `http://localhost:3000/api/student/postStuFeed`;

      const response = await fetch(url, {
        method: curr ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify({ values: { ...values, stuId: user._id, mentoremail: user.mentoremail } }),
      });
      const res = await response.json();
      setCurr(null);
      fetchStuFeedDetails();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div className='d-flex container-fluid gap-4'>
      <div><Sidebar /></div>
      <div className='flex-fill row'>
        {comp && (
          <div className='col-12'>
            <p className='fs-2 fw-bolder m-0'>{curr ? 'Edit Feedback' : 'Add Feedback'}</p>
            <p className='mb-1'>Mentor name: {user.mentor}</p>
            <Formik
              enableReinitialize={true}
              initialValues={curr ? curr : initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => submitForm(values)}
            >
              {props => (
                <Form className='d-flex flex-column gap-3'>
                  <div className="form-floating">
                    <Field className="form-control" as="textarea" id="studentFeedback" name="studentFeedback" style={{ height: '150px' }} />
                    <label htmlFor="studentFeedback">Student Feedback</label>
                    <ErrorMessage component="p" className='text-danger fw-bold' name="studentFeedback" />
                  </div>
                  <div>
                    <button type='submit' disabled={curr && daysSinceCreation(curr.createdAt) > 7} className="btn btn-primary">Submit</button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
        {feed.length > 0 && (
          <div className='col-12 mt-3'>
            <Table striped bordered responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Feedback</th>
                  <th>Created Date</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {feed.map((q, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{q.studentFeedback}</td>
                    <td>{format(parseISO(q.createdAt), 'yyyy-MM-dd')}</td>
                    <td>
                      <button style={{ backgroundColor: "#696747" }} disabled={isAfter(new Date(), addDays(q.createdAt, 1))} className='btn text-white' onClick={() => setCurr(q)} >Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

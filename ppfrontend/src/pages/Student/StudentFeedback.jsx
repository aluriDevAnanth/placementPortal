import React, { useContext, useEffect, useState } from 'react';
import { isAfter, addDays, parseISO, format } from 'date-fns';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import Table from 'react-bootstrap/Table';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function StudentFeedback() {
  const { auth, user } = useContext(AuthCon);
  const [feed, setFeed] = useState();
  const [curr, setCurr] = useState();

  const initialValues = {
    monthlyConnect: "",
    monthlyCount: "",
    meetingConnectionType: "",
    meetingType: "",
    studentFeedback: ""
  };

  const validationSchema = Yup.object().shape({
    studentFeedback: Yup.string().required('Feedback is required'),
    monthlyConnect: Yup.string().required('Feedback is required'),
    monthlyCount: Yup.string().required('Feedback is required'),
    meetingConnectionType: Yup.string().required('Feedback is required'),
    meetingType: Yup.string().required('Feedback is required')
  });

  useEffect(() => {
    if (auth) {
      fetchStuFeedDetails();
    }
  }, [auth]);

  async function fetchStuFeedDetails() {
    try {
      const response = await fetch(`http://localhost:3000/api/student/getStuMenFeed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      console.log(11, res.data.stuFeed);
      setFeed(res.data.stuFeed);
    } catch (error) {
      console.error('Error fetching student feedback details:', error);
    }
  }

  async function submitForm(values) {
    try {
      const url = curr
        ? `http://localhost:3000/api/student/updateStuMenFeed`
        : `http://localhost:3000/api/student/postStuMenFeed`;

      const response = await fetch(url, {
        method: curr ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify({ values: { ...values, stuId: user.rollno, mentoremail: user.mentoremail } }),
      });
      const res = await response.json();
      setCurr(null);
      fetchStuFeedDetails();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  useEffect(() => {
    if (feed) {
      var table = $('#StudentFeedback').DataTable({
        orderCellsTop: true, destroy: true,
        initComplete: function () {
          $('#StudentFeedback thead tr:eq(1) th.text_search').each(function () {
            var title = $(this).text();
            $(this).html(`<input type="text" placeholder="Search ${title}" class="form-control column_search" />`);
          });

        }
      });
      $('#StudentFeedback thead').on('keyup', ".column_search", function () {
        table
          .column($(this).parent().index())
          .search(this.value)
          .draw();
      });
    }
  }, [feed]);

  return (
    <div className='d-flex container-fluid gap-4'>
      <div><Sidebar /></div>
      <div className='flex-fill row'>
        <div className='col-12'>
          <p className='fs-2 fw-bolder m-0'>{curr ? 'Edit Feedback' : 'Add Feedback'}</p>
          <p className='mb-1'>Mentor name: {user.mentor}</p>
          <Formik
            enableReinitialize={true}
            initialValues={curr ? curr : initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => { submitForm(values); }}
          >
            {props => (
              <Form className='d-flex flex-column gap-3 mt-3'>
                <div className="  d-flex gap-2">
                  <label className='form-check-label' htmlFor="monthlyConnect">Did your mentor meet you in this month: </label>
                  <Field type="radio" className="form-check-input" id="monthlyConnectYes" name="monthlyConnect" value="Yes" />
                  <label className='form-check-label' htmlFor="monthlyConnectYes">Yes</label>
                  <Field type="radio" className="form-check-input" id="monthlyConnectNo" name="monthlyConnect" value="No" />
                  <label className='form-check-label' htmlFor="monthlyConnectNo">No</label>
                  <ErrorMessage component="p" className='text-danger fw-bold m-0' name="monthlyConnect" />
                </div>


                <div className="form-floating">
                  <Field as="select" className="form-control" id="monthlyCount" name="monthlyCount">
                    <option disabled value="">Select A number from 1 to 10</option>
                    {[...Array(10)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>{index + 1}</option>
                    ))}
                  </Field>
                  <label htmlFor="monthlyCount">How many times did the mentor meet you in this month</label>
                  <ErrorMessage component="p" className="text-danger fw-bold m-0" name="monthlyCount" />
                </div>

                <div className="form-floating">
                  <Field className="form-select" name="meetingConnectionType" id="meetingConnectionType" as="select">
                    <option value="" disabled>Select an option</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone call</option>
                    <option value="physical">Physical</option>
                    <option value="onlineMeeting">Online meeting</option>
                  </Field>
                  <label htmlFor="meetingConnectionType">how did your mentor connect with you</label>
                  <ErrorMessage component="p" className='text-danger fw-bold m-0' name="meetingConnectionType" />
                </div>

                <div className="form-floating">
                  <Field className="form-select" name="meetingType" id="meetingType" as="select">
                    <option value="" disabled>Select an option</option>
                    <option value="oneOnOne">One on One</option>
                    <option value="groupMeeting">Group Meeting</option>
                  </Field>
                  <label htmlFor="meetingType">how did your mentor meet with you</label>
                  <ErrorMessage component="p" className='text-danger fw-bold m-0' name="meetingType" />
                </div>

                <div className="form-floating">
                  <Field className="form-control" as="textarea" id="studentFeedback" name="studentFeedback" style={{ height: '150px' }} />
                  <label htmlFor="studentFeedback">Share remarks for mentor meeting</label>
                  <ErrorMessage component="p" className='text-danger fw-bold m-0' name="studentFeedback" />
                </div>
                <div>
                  <button type='submit' className="btn btn-primary">Submit</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {feed && (
          <div className='col-12 mt-3 w-100'>
            <Table id="StudentFeedback" striped bordered responsive hover>
              <thead>
                <tr className='text-center'>
                  <th>#</th>
                  <th>monthly Count</th>
                  <th>monthly Connect</th>
                  <th>meeting Connection Type</th>
                  <th>meeting Type</th>
                  <th>Feedback</th>
                  <th>Created Date</th>
                  <th>Options</th>
                </tr>
                <tr className='text-center'>
                  <th className='text_search'>#</th>
                  <th className='text_search'>monthly Count</th>
                  <th className='text_search'>monthly Connect</th>
                  <th className='text_search'>meeting Connection Type</th>
                  <th className='text_search'>meeting Type</th>
                  <th className='text_search'>Feedback</th>
                  <th className='text_search'>Created Date</th>
                  <th className=' '> </th>
                </tr>
              </thead>
              <tbody>
                {feed.slice().reverse().map((q, i) => (
                  <tr className='text-center' key={i}>
                    <td>{i + 1}</td>
                    <td>{q.monthlyCount}</td>
                    <td>{q.monthlyConnect}</td>
                    <td>{q.meetingConnectionType}</td>
                    <td>{q.meetingType}</td>
                    <td>{q.studentFeedback}</td>
                    <td>{format(parseISO(q.createdAt), 'yyyy-MM-dd')}</td>
                    <td> <button style={{ backgroundColor: "#696747" }} disabled={isAfter(new Date(), addDays(q.createdAt, 1))}
                      className='btn text-white' onClick={() => setCurr(q)} > Edit </button> </td>

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

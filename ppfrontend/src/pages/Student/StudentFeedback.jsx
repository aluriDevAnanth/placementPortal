import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { format, parseISO, isAfter, addDays } from 'date-fns';

export default function StudentFeedback() {
  const { auth, user } = useContext(AuthCon);
  const [feed, setFeed] = useState([]);
  const [curr, setCurr] = useState(null);
  const baseURL = process.env.BASE_URL

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
      const response = await fetch(`${baseURL}/student/getStuMenFeed`, {
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
        ? `${baseURL}/student/updateStuMenFeed`
        : `${baseURL}/student/postStuMenFeed`;

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
      await fetchStuFeedDetails();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  const dateTemplate = (rowData) => {
    return format(parseISO(rowData.createdAt), 'yyyy-MM-dd');
  };

  const editButtonTemplate = (rowData) => {
    const disabled = isAfter(new Date(), addDays(parseISO(rowData.createdAt), 1));
    return (
      <Button
        label="Edit"
        className="btn text-white"
        style={{ backgroundColor: "#696747" }}
        disabled={disabled}
        onClick={() => setCurr(rowData)}
      />
    );
  };

  const FeedbackTable = ({ feed }) => (
    <div>
      <DataTable value={feed.slice().reverse()} className="p-datatable-sm" stripedRows showGridlines paginator rows={10} rowsPerPageOptions={[25, 50]} removableSort filterDisplay="row" emptyMessage="No Feedback found." resizableColumns size='small'>
        <Column className='text-center' sortable filter showFilterMenu={false} filterMatchMode="contains" field="monthlyCount" header="Monthly Count" />
        <Column className='text-center' sortable filter showFilterMenu={false} filterMatchMode="contains" field="monthlyConnect" header="Monthly Connect" />
        <Column className='text-center' sortable filter showFilterMenu={false} filterMatchMode="contains" field="meetingConnectionType" header="Meeting Connection Type" />
        <Column className='text-center' sortable filter showFilterMenu={false} filterMatchMode="contains" field="meetingType" header="Meeting Type" />
        <Column className='text-center' sortable filter showFilterMenu={false} filterMatchMode="contains" field="studentFeedback" header="Feedback" />
        <Column className='text-center' sortable filter showFilterMenu={false} filterMatchMode="contains" field="createdAt" header="Created Date" body={dateTemplate} />
        <Column className='text-center' body={editButtonTemplate} header="Options" />
      </DataTable>

    </div>
  );

  return (
    <div className='d-flex container-fluid gap-4'>
      <div><Sidebar /></div>
      <div className='flex-fill row'>
        <div className='col-12'>
          <p className='fs-2 fw-bolder m-0'>{curr ? 'Edit Feedback' : 'Add Feedback'}</p>
          <p className='mb-1'>Mentor name: {user.mentoremail}</p>
          <Formik
            enableReinitialize={true}
            initialValues={curr ? curr : initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => { submitForm(values); }}
          >
            {props => (
              <Form className='d-flex flex-column gap-3 mt-3'>
                <div className="d-flex gap-2">
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
                  <label htmlFor="meetingConnectionType">How did your mentor connect with you</label>
                  <ErrorMessage component="p" className='text-danger fw-bold m-0' name="meetingConnectionType" />
                </div>

                <div className="form-floating">
                  <Field className="form-select" name="meetingType" id="meetingType" as="select">
                    <option value="" disabled>Select an option</option>
                    <option value="oneOnOne">One on One</option>
                    <option value="groupMeeting">Group Meeting</option>
                  </Field>
                  <label htmlFor="meetingType">How did your mentor meet with you</label>
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

        {feed.length > 0 && (
          <div className='col-12 mt-3 w-100 table-responsive'>
            <FeedbackTable feed={feed} />
          </div>
        )}
      </div>
    </div>
  );
}

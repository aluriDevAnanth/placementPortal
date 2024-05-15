import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import Cookies from 'js-cookie';

export default function AdminSettings() {
  const { user, auth, setAuth, setUser } = useContext(AuthCon);

  // Define validation schema using Yup
  const validationSchema = Yup.object().shape({
    pass: Yup.string().required('New password is required'),
    cpass: Yup.string().oneOf([Yup.ref('pass'), null], 'Passwords must match').required('Confirm password is required'),
  });

  const chgnPwd = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/api/mentor/chgnPwd/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify({ ...values }),
      });
      const res = await response.json();
      if (res.success) {
        alert('Done! password changed, now you are going to logout so you have to login again')
        Cookies.remove('token');
        setAuth(null);
        setUser(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    user !== null && (
      <div className='bodyBG'>
        <div className='container-fluid'>
          <div className='d-flex'>
            <div className='me-4'>
              <Sidebar />
            </div>
            <div className='flex-fill container'>
              <Formik
                initialValues={{ pass: '', cpass: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  chgnPwd(values);
                  setSubmitting(false);
                }}
              >
                {formik => (
                  <Form style={{ width: '30rem' }}>
                    <div className="form-floating mb-3">
                      <Field name="pass" type="password" className="form-control" id="newPassword" placeholder="New Password" />
                      <label htmlFor="newPassword" className="form-label">New Password</label>
                      <ErrorMessage name="pass" component="div" className="text-danger" />
                    </div>
                    <div className="form-floating mb-3">
                      <Field name="cpass" type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" />
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <ErrorMessage name="cpass" component="div" className="text-danger" />
                    </div>
                    <button className='btn btn-primary' type="submit" disabled={formik.isSubmitting}>Submit</button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

import React, { useContext, useState } from 'react';
import Sidebar from './components/ParentSidebar';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import AuthCon from '../../context/AuthPro';
import Cookies from 'js-cookie';

export default function ParentSettings() {
  const { auth, setAuth, setUser } = useContext(AuthCon)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const baseURL = process.env.BASE_URL

  function validateForm() {
    const errors = {};
    if (!password) {
      errors.password = 'Password is required';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function subPassChng(e) {
    e.preventDefault();
    if (validateForm()) {
      const form = document.querySelector('form');
      const formData = new FormData(form);
      const password = formData.get('pass');
      const confirmPassword = formData.get('cpass');
      const data = { pass: password, cpass: confirmPassword }
      //console.log(data);
      const response = await fetch(`${baseURL}/parent/changePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`
        },
        body: JSON.stringify({ ...data })
      });

      const res = await response.json();
      if (res.success) {
        alert('Done! password changed, now you are going to logout so you have to login again')
        Cookies.remove('token');
        setAuth(null);
        setUser(null);
        window.location.reload();
      }
    }
  }

  return (
    <div className=' container-fluid d-flex'>
      <div >
        <Sidebar />
      </div>
      <div className='ms-3 container-fluid mb-5'>
        <p className='fs-3 fw-bold'>Change Info</p>
        <Form onSubmit={subPassChng} className='w-50'>
          <FloatingLabel className="mb-3" label="Enter Password" controlId="formGroupPassword">
            <Form.Control name='pass' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="Confirm Password" controlId="formGroupCPassword">
            <Form.Control name='cpass' type="password" placeholder="Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {errors.confirmPassword && <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>}
          </FloatingLabel>
          <button className="btn btn-primary">Submit</button>
        </Form>
      </div>
    </div>
  );
}

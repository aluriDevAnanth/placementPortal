import React, { useContext, useState } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'

export default function DeanSettings() {
  const [err, setErr] = useState()
  const { auth } = useContext(AuthCon)

  async function handlePassChange(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }

    const { pass, cpass } = q;

    if (pass !== cpass) {
      setErr({ err: "Passwords do not match", type: 'danger' });
    } else {
      try {
        setErr(null);
        const response = await fetch(`http://localhost:3000/api/dean/chgnPwd`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`,
          },
          body: JSON.stringify({ pass })
        });

        if (!response.ok) {
          throw new Error(`Failed to update password: ${response.statusText}`);
        }

        const res = await response.json();
        console.log(res);
      } catch (error) {
        console.error("Error updating password:", error);
        setErr({ err: "Failed to update password", type: 'danger' });
      }
    }
  }


  return (
    <div>
      <div className='d-flex'>
        <div className='me-3'>
          <Sidebar />
        </div>
        <div>
          <form className='mb-3' onSubmit={handlePassChange} style={{ width: '25rem' }}>
            <div className="form-floating mb-3">
              <input name='pass' type="password" className="form-control" id="pass" placeholder="Password" />
              <label htmlFor="pass">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input name='cpass' type="password" className="form-control" id="cpass" placeholder="Password" />
              <label htmlFor="cpass">Confirm Password</label>
            </div>
            <div>
              <button type='submit' className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
          {err && <div>
            <div class={`alert alert-${err.type}`} role="alert"> {err.err} </div>
          </div>}
        </div>
      </div>
    </div>
  )
}

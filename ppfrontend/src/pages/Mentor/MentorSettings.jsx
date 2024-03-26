import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';

export default function MentorSettings() {
  const { user, auth } = useContext(AuthCon);
  const [err, setErr] = useState('');
  const [err2, setErr2] = useState('');

  const mystyle = {
    backgroundColor: "#696747 !important",
  };

  const upDet = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }

    const response = await fetch('http://localhost:3000/api/mentor/upDet/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify(q),
    });
    const res = await response.json();
    setErr2({ e: "Done!", type: "success" })

  };

  const chgnPwd = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }

    if (q.pass === q.cpass) {
      const response = await fetch('http://localhost:3000/api/mentor/chgnPwd/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify(q),
      });
      setErr({ e: "Done!", type: "success" })
    } else {
      setErr({ e: "Passwords do not match", type: "danger" })
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
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Update Details</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Change password</button>
                </li>
              </ul>
              <div className="tab-content bg-white" id="myTabContent">
                <div className="tab-pane fade show active p-3" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                  <form onSubmit={upDet} style={{ width: '30rem' }}>
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" id="phone" name="phoneno" placeholder="Update Phone No" />
                      <label htmlFor="phone" className="form-label">Update Phone</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" id="cabin" name="cabin" placeholder="Update Cabin Details" />
                      <label htmlFor="cabin" className="form-label">Update Cabin</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" id="department" name="dept" placeholder="Update Department Details" />
                      <label htmlFor="department" className="form-label">Update Department</label>
                    </div>
                    <button className='btn btn-primary' type="submit">Submit</button>
                    {err2 !== "" && <div className={`alert alert-${err2.type} mt-3 text-center`} role="alert">
                      {err2.e}
                    </div>}
                  </form>
                </div>
                <div className="tab-pane fade p-3" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                  <form onSubmit={chgnPwd} style={{ width: '30rem' }}>
                    <div className="form-floating mb-3">
                      <input name="pass" type="password" className="form-control" id="newPassword" placeholder="New Password" />
                      <label htmlFor="newPassword" className="form-label">New Password</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input name="cpass" type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" />
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    </div>
                    <button className='btn btn-primary' type="submit">Submit</button>
                    {err !== "" && <div className={`alert alert-${err.type} mt-3 text-center`} role="alert">
                      {err.e}
                    </div>}

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

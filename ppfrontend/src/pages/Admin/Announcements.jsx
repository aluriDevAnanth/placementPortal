import React, { useContext, useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';
import AdminCon from '../../context/AdminPro'
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { format, parseISO } from 'date-fns'
import Modal from 'react-bootstrap/Modal';

export default function Announcements() {
  const { auth } = useContext(AuthCon);
  const { stu, year, setStu } = useContext(AdminCon)
  const baseURL = process.env.BASE_URL
  const [ann, setAnn] = useState()

  const fetchAnn = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/getAnn/${year.curr}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      console.log(res);
      setAnn(res.data.ann)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  async function postAnn(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const des = formData.get('ann');
    const response = await fetch(`${baseURL}/admin/postAnn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      }, body: JSON.stringify({ des, batch: year.curr }),
    });
    const res = await response.json();
    console.log(res);
  }

  useEffect(() => {
    if (year.curr) fetchAnn()
  }, [year.curr])


  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container w-100'>
          <p></p>
          <form className='mb-3' onSubmit={postAnn}>
            <textarea className='form-control mb-3' name="ann" id="" cols="30" rows="10"></textarea>
            <button className="btn btn-primary">Submit</button>
          </form>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr className='text-center'>
                  <th>Des</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ann && ann.reverse().map(a => {
                  return <tr className='text-center'>
                    <td>{a.des}</td>
                    <td> {format(parseISO(a.createdAt), 'dd-MM-yyyy hh:mm aa')} </td>
                  </tr>
                })}

              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

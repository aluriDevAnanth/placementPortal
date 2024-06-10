import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { useParams } from 'react-router-dom';
import AuthCon from '../../context/AuthPro';
import QRCode from "react-qr-code";

export default function CurrEvent() {
  const { eid } = useParams();
  const { auth } = useContext(AuthCon);
  const [event, setEvent] = useState();
  const [qrValue, setQRValue] = useState();
  const baseURL = process.env.BASE_URL

  useEffect(() => {
    fetchEvent();
  }, [])

  useEffect(() => {
    if (event) {
      fetchRandomValue();
      const intervalId = setInterval(() => {
        fetchRandomValue();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [event]);

  async function fetchEvent() {
    try {
      const response = await fetch(`${baseURL}/admin/getEvent/${eid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      setEvent(res.data[0]);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  }

  async function fetchRandomValue() {

    const response = await fetch(`${baseURL}/admin/getRandomValue`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setQRValue({ rand: res.data.randomValue, eid: event._id });

  }

  return (
    <>
      <div className='container-fluid d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='d-flex ms-4'>
          <div className='d-flex flex-column'>
            <h2>Name: {event?.name} </h2>
            <p>Description: {event?.des}</p>
            <p>Start Time: {event ? new Date(event.startTime).toLocaleString() : ''}</p>
            <p>End Time: {event ? new Date(event.endTime).toLocaleString() : ''}</p>
            <p>Recurrence: {event?.rec}</p>
            <h3>Students:</h3>
          </div>
          {qrValue && <div>
            <QRCode
              size={1000} style={{ height: "300px", maxWidth: "100%", width: "100%" }} value={JSON.stringify(qrValue)} viewBox={`0 0 256 256`} />
            <p className='mt-3'>{qrValue.rand}</p>
          </div>}
        </div>
      </div>
      <div className='container mt-3'>
        <div>
          {event && (
            <table className='table table-hover table-bordered table-striped'>
              <thead>
                <tr>
                  <th>Rollno</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {event.students.map(student => (
                  <tr key={student.rollno}>
                    <th>{student.name}</th>
                    <th>{student.rollno}</th>
                    <th>{student.email}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

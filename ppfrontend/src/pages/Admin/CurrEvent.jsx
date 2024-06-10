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
  const [sess, setSess] = useState(false);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const baseURL = process.env.BASE_URL

  useEffect(() => {
    fetchEvent();
  }, []);

  async function fetchTokens(sessionId) {
    try {
      const response = await fetch(`${baseURL}/admin/startQrSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      const res = await response.json(); console.log(res.data);
      return res.data.tokens;
    } catch (error) {
      console.error('Fetching tokens failed:', error);
      return [];
    }
  }

  function startSession() {

  }

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

  return (
    <>
      <div className='container-fluid d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='d-flex ms-4 w-100'>
          <div className='d-flex flex-column'>
            <h2>Name: {event?.name} </h2>
            <p>Description: {event?.des}</p>
            <p>Start Time: {event ? new Date(event.startTime).toLocaleString() : ''}</p>
            <p>End Time: {event ? new Date(event.endTime).toLocaleString() : ''}</p>
            <p>Recurrence: {event?.rec}</p>
            <h3>Students:</h3>
          </div>
          {qrValue && sess ? (
            <div className='ms-5'>
              <QRCode size={1000} style={{ height: "600px", maxWidth: "100%", width: "100%" }} value={qrValue} viewBox={`0 0 256 256`} />
              <p className='mt-3'>{qrValue.rand}</p>
              <div className='my-auto mx-auto'>
                <button onClick={() => { setSess(false); }} className='btn btn-danger '>End Session</button>
              </div>
            </div>
          ) : (
            <div className='my-auto mx-auto'>
              <button onClick={() => { setSess(true); startSession(); }} className='btn btn-primary '>Start Session</button>
            </div>
          )}
        </div>
      </div>
      <div className='container-fluid mt-3'>
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
                {event.students.map((student, i) => (
                  <tr key={i}>
                    <th>{student}</th>
                    <th>{student}</th>
                    <th>{student}</th>
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

import React, { useContext, useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import { FaRegTrashAlt } from "react-icons/fa";

import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';

import SetEvent from './SetEvent';

export default function Events() {
  const { auth } = useContext(AuthCon);
  const [showSetEvent, setShowSetEvent] = useState(false)
  const [events, setEvents] = useState(false)

  const handleSetEvent = () => {
    setShowSetEvent(!showSetEvent)
  }

  async function fetchEvents(e) {
    const response = await fetch('http://localhost:3000/api/admin/getEvents', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setEvents(res.data)
    console.log(res)
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  async function deleteEvent(e) {
    const id = e.currentTarget.value;
    const response = await fetch(`http://localhost:3000/api/admin/deleteEvent/${e.currentTarget.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    const qq = events.filter(q => q._id !== id)
    setEvents(qq)
  }


  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container w-100'>
          <div className='d-flex'>
            <div>
              <button onClick={handleSetEvent} className='btn btn-primary' >Add Event</button>
            </div>
            {showSetEvent && <SetEvent fetchEvents={fetchEvents} setShowSetEvent={setShowSetEvent} />}
          </div>
        </div>
      </div>
      <div className='container mt-4'>
        <p className='fs-3 fw-bolder'>Current Events</p>
        <table className='table table-bordered table-striped table-hover'>
          <thead>
            <tr className='text-center'>
              <th>Name</th>
              <th>Des</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Rec</th>
              <th>Status</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events && events.map((q, i) => {
              return <tr style={{ opacity: q.isExp ? 0.5 : 1 }} className='text-center' key={i}>
                <th>{q.name}</th>
                <th>{q.des}</th>
                <th>{format(parseISO(q.startTime), "dd-MM-yyyy hh:mm a")}</th>
                <th>{format(parseISO(q.endTime), "dd-MM-yyyy hh:mm a")}</th>
                <th>{q.rec}</th>
                <th>{q.isExp && <h6> <span className="badge text-bg-danger">Expired</span></h6>
                } {q.isHap && <h6> <span className="badge text-bg-success">Happenning Now</span></h6>
                  }</th>
                <th>{q.students.length}</th>
                <th className='p-2'>
                  <button type="button" onClick={deleteEvent} className="btn" value={q._id}>
                    <FaRegTrashAlt style={{ color: 'red' }} />
                  </button>
                </th>
              </tr>
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}

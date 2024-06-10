import React, { useContext, useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';

export default function Events() {
  const { auth } = useContext(AuthCon);
  const [events, setEvents] = useState([]);
  const baseURL = process.env.BASE_URL

  async function fetchEvents() {
    const response = await fetch(`${baseURL}/admin/getEvents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setEvents(res.data || []);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <div className='container-fluid d-flex'>
        <div className=''>
          <Sidebar />
        </div>
        <div className='ms-3 me-3  w-100'>
          <div className='d-flex'>
            <div>
            </div>
          </div>
        </div>
      </div>
      <div className='container-fluid mt-4'>
        <p className='fs-3 fw-bolder'>Current Events</p>
        <table className='table table-bordered table-striped table-hover'>
          <thead>
            <tr className='text-center'>
              <th>Name</th>
              <th>Description</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Rec</th>
              <th>Status</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className='text-center' style={{ opacity: event.isExp ? 0.5 : 1 }}>
                <td>{event.name}</td>
                <td>{event.des}</td>
                <td>{format(parseISO(event.startTime), "dd-MM-yyyy hh:mm a")}</td>
                <td>{format(parseISO(event.endTime), "dd-MM-yyyy hh:mm a")}</td>
                <td>{event.rec}</td>
                <td>
                  {event.isExp && <span className="badge bg-danger text-white">Expired</span>}
                  {event.isHap && <span className="badge bg-success text-white">Happening Now</span>}
                </td>
                <td>{event.students.length}</td>
                <td className='p-2'>
                  {!event.isExp ? (
                    <Link to={`/currevent/${event._id}`} className="btn btn-secondary me-2">Details</Link>
                  ) : (
                    <span className="btn btn-secondary me-2 disabled">Details</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

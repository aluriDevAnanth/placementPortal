import React from 'react'
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 rounded-3 text-center position-sticky" style={{ backgroundColor: "rgb(105, 103, 71)", width: "250px", maxHeight: "100vh" }}>
      <Link className="fs-6 fw-bolder nav-link active text-white" to="/">Home</Link><hr />
      <Link className="fs-6 fw-bolder nav-link active text-white" to="/events">Events</Link>
    </div>
  )
}

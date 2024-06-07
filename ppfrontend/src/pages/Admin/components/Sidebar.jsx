import React from 'react'
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 rounded-3 text-center position-sticky ms-3" style={{ backgroundColor: "rgb(105, 103, 71)", width: "250px" }}>
      <Link className="fs-5 fw-3 nav-link active text-white" to="/">Home</Link><hr />
      <Link className="fs-5 fw-3 nav-link text-white" to="/setevent">Events</Link><hr />
      <Link className="fs-5 fw-3 nav-link text-white" to="/students">Students</Link><hr />
      <Link className="fs-5 fw-3 nav-link text-white" to="/companies">Companies</Link>
    </div>

  )
}

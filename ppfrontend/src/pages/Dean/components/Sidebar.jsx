import React from 'react'
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 rounded-3 text-center position-sticky ms-3" style={{ backgroundColor: "rgb(105, 103, 71)", width: "250px", maxHeight: "100vh" }}>
      <Link className="fs-5 fw-3 nav-link active text-white" to="/">Home</Link><hr />
      <Link className="fs-5 fw-3 nav-link text-white" to="/menteeslist">Mentees List</Link><hr />
      <Link className="fs-5 fw-3 nav-link text-white" to="/menteesearch">Mentee Search</Link><hr />
      <Link className="fs-5 fw-3 nav-link text-white" to="/mentorfeedback">Mentor Feedback</Link>
    </div>

  )
}

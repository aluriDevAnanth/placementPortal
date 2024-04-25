import React from 'react'
import { Link } from 'react-router-dom';

export default function ParentSidebar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 rounded-3 text-center position-sticky" style={{ backgroundColor: "rgb(105, 103, 71)", width: "250px", maxHeight: "100vh" }}>
      <Link className="fs-6 fw-bolder nav-link active text-white" to="/">Home</Link><hr />
      <Link className="fs-6 fw-bolder nav-link text-white" to="/attendence">Attendance</Link><hr />
      <Link className="fs-6 fw-bolder nav-link text-white" to="/testresult">Test Result</Link><hr />
      <Link className="fs-6 fw-bolder nav-link text-white" to="/testschedule">Test Schedule</Link><hr />
      <Link className="fs-6 fw-bolder nav-link text-white" to="/companiescorner">Companies Corner</Link><hr />
      <Link className="fs-6 fw-bolder nav-link text-white" to="/placementcorner">Placement Corner</Link><hr />
      <Link className="fs-6 fw-bolder nav-link text-white" to="/mentordetails">Mentor Details</Link><hr />
      <Link className="fs-6 fw-bolder nav-link text-white" to="/contactus">Contact Us</Link>
    </div>
  )
}

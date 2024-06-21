import React from 'react'
import { Link } from 'react-router-dom';

export default function ParentSidebar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 rounded-3 text-center position-sticky" style={{ backgroundColor: "rgb(105, 103, 71)", width: "250px", maxHeight: "100vh" }}>
      <Link className="fs-6 fw-bolder nav-link active text-white" to="/">Home</Link><hr />
      {/* <Link className="fs-6 fw-bolder nav-link text-white" to="/placementcorner">Placement Data</Link><hr /> */}
      <Link className="fs-6 fw-bolder nav-link text-white" to="/attendence">Training Attendance</Link><hr />
      {/* <Link className="fs-6 fw-bolder nav-link text-white" to="/testresult">Practise Test Result</Link><hr />
      <Link className="fs-6 fw-bolder nav-link text-white" to="/mypractise">Student Practise Details</Link><hr />
       */}
      <Link className="fs-6 fw-bolder nav-link active text-white" to="/placementpolicy">Placement Policy</Link><hr />
      {/* <Link className="fs-6 fw-bolder nav-link text-white" to="/mentordetails">Mentor Details</Link><hr /> */}
      <Link className="fs-6 fw-bolder nav-link text-white" to="/contactus">Contact Us</Link>
    </div>
  )
}

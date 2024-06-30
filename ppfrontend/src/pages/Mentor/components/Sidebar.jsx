import React from 'react'
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 rounded-3 text-center position-sticky" style={{ backgroundColor: "rgb(105, 103, 71)", width: "250px", maxHeight: "100vh" }}>
            <Link className="fs-6 fw-bolder nav-link active text-white" to="/">Home</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/studentprogress">Mentee Company Dashboard</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/menteespractisedetails">Mentees Practise Details</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/menteestrainingattendance">Mentees Training Attendance</Link>
            <hr /> <Link className="fs-6 fw-bolder nav-link text-white" to="/mentorfeedback">Record Feedback for Mentee</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/companydetails">Company Details</Link> <hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/menteesmail">Email Mentee</Link>
        </div>

    )
}

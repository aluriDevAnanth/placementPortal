import React from 'react'
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 rounded-3 text-center position-sticky" style={{ backgroundColor: "rgb(105, 103, 71)", width: "250px", maxHeight: "100vh" }}>
            <Link className="fs-6 fw-bolder nav-link active text-white" to="/">Home</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/studentprogress">Student Progress</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/practicereport">Practice Report</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/attendence">Attendance</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/testschedule">Test Schedule</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/mentorfeedback">Mentor Feedback</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/menteesearch">Search</Link> <hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/menteesmail">Mentees Mail</Link> <hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/companiescorner">Companies Corner</Link><hr />
            <Link className="fs-6 fw-bolder nav-link text-white" to="/placementcorner">Placement Corner</Link>
        </div>

    )
}

import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Spinner from 'react-bootstrap/Spinner';
import AuthCon from '../../context/AuthPro';
import MentorCon from "../../context/MentorPro";
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import { format, parseISO } from 'date-fns';

export default function PlacementCorner() {
  const { user, auth } = useContext(AuthCon);
  const { year } = useContext(MentorCon);
  const [placeCom, setPlaceCom] = useState();
  const [allStu, setAllStu] = useState();
  const [loading, setLoading] = useState(false);

  async function fetchPlaceComInfo() {
    const response = await fetch(`http://localhost:3000/api/mentor/getPlaceCom/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    if (res.success) { setPlaceCom(res.data); setLoading(false) }
  }

  async function fetchAllStu() {
    const response = await fetch(`http://localhost:3000/api/mentor/getAllStu/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    if (res.success) { setAllStu(res.data); setLoading(false) }
  }

  useEffect(() => {
    setLoading(true)
    fetchPlaceComInfo();
    fetchAllStu();
  }, [year]);

  // Function to find student details by roll number
  const findStudentByRollNo = (rollNo) => {
    return allStu.find(student => student.rollno === rollNo);
  };

  return (
    <div className='container-fluid d-flex'>
      <div>
        <Sidebar />
      </div>
      {!loading ? (
        <div className='ms-4 flex-fill me-3'>
          {placeCom &&
            <Accordion alwaysOpen>
              {placeCom.map((q, i) => {
                return (
                  <div key={i} className='me-1' >
                    <Accordion.Item eventKey={i} key={i}>
                      <Accordion.Header>{q.name}</Accordion.Header>
                      <Accordion.Body>
                        <ListGroup>
                          <ListGroup.Item>Job Role: {q.jodRole}</ListGroup.Item>
                          <ListGroup.Item>CTC: {q.CTC}</ListGroup.Item>
                          <ListGroup.Item>category: {q.category}</ListGroup.Item>
                          <ListGroup.Item>batch: {q.batch}</ListGroup.Item>
                          <ListGroup.Item>Eligible: {q.eligible}</ListGroup.Item>
                          <ListGroup.Item>Applied: {q.applied}</ListGroup.Item>
                          <ListGroup.Item> Date Of Visit:  {q.dateOfVisit}</ListGroup.Item>
                          <ListGroup.Item> Eligible Students: {q.eligibleStudents.join(", ")} </ListGroup.Item>
                          <ListGroup.Item> Applied Students: {q.appliedStudents.join(", ")} </ListGroup.Item>
                          <ListGroup.Item>Mode Of Drive: {q.modeOfDrive}</ListGroup.Item>
                          <ListGroup.Item>Status Of Drive: {q.statusOfDrive}</ListGroup.Item>
                          <ListGroup.Item>
                            <p className='fs-4 fw-3'>Stages</p>
                            {allStu && Object.keys(q.stages).map((stageCategory, index) => (
                              <Accordion key={index} alwaysOpen>
                                <Accordion.Header>{stageCategory} - {q.stages[stageCategory].length} members</Accordion.Header>
                                <Accordion.Body>
                                  <Table striped bordered hover responsive>
                                    <thead>
                                      <tr>
                                        <th>Name</th>
                                        <th>Roll No</th>
                                        <th>Email</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {q.stages[stageCategory].map((rollNo, idx) => {
                                        const student = findStudentByRollNo(rollNo);
                                        if (student) {
                                          return (
                                            <tr key={idx}>
                                              <td>{student.name}</td>
                                              <td>{student.rollno}</td>
                                              <td>{student.email}</td>
                                            </tr>
                                          );
                                        } else {
                                          return null;
                                        }
                                      })}
                                    </tbody>
                                  </Table>
                                </Accordion.Body>
                              </Accordion>
                            ))}
                          </ListGroup.Item>
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  </div>

                );
              })}
            </Accordion>
          }
        </div>
      ) : (
        <div className='w-100 d-flex justify-content-center ms-auto'><Spinner animation="border" variant="dark" /></div>
      )}
    </div>
  );
}

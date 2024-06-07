import React, { useContext, useEffect, useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import { isAfter, parseISO, format, addDays } from 'date-fns'
import ListGroup from 'react-bootstrap/ListGroup';
import { Accordion, Button, Form, Table, Tab, Nav, FloatingLabel } from 'react-bootstrap';


import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';

export default function CompanyDetails() {
  const { user, auth } = useContext(AuthCon);
  const { students, year } = useContext(MentorCon);
  const toast = useRef(null);
  const [expandedRows, setExpandedRows] = useState();
  const [com, setCom] = useState();

  async function fetchCompanies() {
    const response = await fetch(`http://localhost:3000/api/mentor/getCom/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    console.log(res.data);
    setCom(res.data);
  }

  useEffect(() => {
    if (year.curr) fetchCompanies();
  }, [year])

  const onRowExpand = (event) => {
    toast.current.show({ severity: 'info', summary: 'Info Expanded', detail: event.data.name, life: 3000 });
  };

  const onRowCollapse = (event) => {
    toast.current.show({ severity: 'success', summary: 'Info Collapsed', detail: event.data.name, life: 3000 });
  };

  const allowExpansion = (rowData) => {
    return com;
  };

  const rowExpansionTemplate = (q) => {
    //console.log('stu', students);
    const roll = Object.keys(students);
    const set1 = new Set(roll);
    const commEli = q.eligibleStudents.filter(item => set1.has(item));
    const commApp = q.appliedStudents.filter(item => set1.has(item));

    return (
      students && (
        <ListGroup>
          <ListGroup.Item>Job Role: {q.jobRole}</ListGroup.Item>
          <ListGroup.Item>CTC: {q.CTC}</ListGroup.Item>
          <ListGroup.Item>Category: {q.category}</ListGroup.Item>
          <ListGroup.Item>Batch: {q.batch}</ListGroup.Item>
          <ListGroup.Item>Eligible: {commEli.length}</ListGroup.Item>
          <ListGroup.Item>Applied: {commApp.length}</ListGroup.Item>
          <ListGroup.Item>
            Date Of Visit: {q.dateOfVisit ? format(parseISO(q.dateOfVisit), 'yyyy-MM-dd') : ''}
          </ListGroup.Item>
          <ListGroup.Item>
            Eligible Students: {q.eligibleStudents &&
              q.eligibleStudents.map((rollno, i) => {
                const student = students[rollno];
                return student ? <span key={i}>{student.name}, </span> : null;
              })}
          </ListGroup.Item>
          <ListGroup.Item>
            Applied Students: {q.appliedStudents &&
              q.appliedStudents.map((rollno, i) => {
                const student = students[rollno];
                return student ? <span key={i}>{student.name}, </span> : null;
              })}
          </ListGroup.Item>
          <ListGroup.Item>
            Shortlisted Students: {q.shortlistedStudents &&
              q.shortlistedStudents.map((rollno, i) => {
                const student = students[rollno];
                return student ? <span key={i}>{student.name}, </span> : null;
              })}
          </ListGroup.Item>
          <ListGroup.Item>
            Placed Students: {q.placedStudents &&
              q.placedStudents.map((studentId, i) => {
                const student = students[studentId];
                return student ? <span key={i}>{student.name}, </span> : null;
              })}
          </ListGroup.Item>
          <ListGroup.Item>Mode Of Drive: {q.modeOfDrive}</ListGroup.Item>
          <ListGroup.Item>Status Of Drive: {q.driveStatus}</ListGroup.Item>
          <ListGroup.Item>
            <p className="fs-4 fw-3">Stages</p>
            {students &&
              Object.keys(q.stages).map((stageCategory, index) => (
                <Accordion key={index} alwaysOpen>
                  <Accordion.Header>
                    {stageCategory} - Total{' '}
                    {Object.keys(q.stages[stageCategory]).filter(stageKey =>
                      Object.keys(students).includes(stageKey)
                    ).length}{' '}
                    members
                  </Accordion.Header>
                  <Accordion.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Roll No</th>
                          <th>Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(q.stages[stageCategory]).map((rollNo, idx) => {
                          const student = students[rollNo];
                          if (student) {
                            return (
                              <tr key={idx}>
                                <td>{student.name}</td>
                                <td>{student.rollno}</td>
                                <td>{student.email}</td>
                                <td>{q.stages[stageCategory][rollNo]}</td>
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
      )
    );
  };

  return (
    user !== null && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div className="position-sticky">
              <Sidebar />
            </div>
            <div className="flex-fill rounded-3 ms-3 border-primary me-3">
              <Toast ref={toast} />
              <DataTable size={'small'} value={com} className="p-datatable-striped p-datatable-hover" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort sortMode="multiple" filterDisplay="row" emptyMessage="No Company found." expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}>
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="dateOfVisit" header="Date Of Visit" filter sortable showFilterMenu={false} filterMatchMode="contains" body={(data, props) => { return <p> {format(parseISO(data.dateOfVisit), 'yyyy-MM-dd')}</p> }} />
                <Column field="modeOfDrive" header="Mode Of Drive" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="jodRole" header="Job Role" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="CTC" header="CTC" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="eligible" header="Eligible" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="applied" header="Applied" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="shortlisted" header="Short Listed" filter sortable showFilterMenu={false} filterMatchMode="contains" />
              </DataTable>
            </div>
          </div>
        </div>
      </div >
    )
  );
}

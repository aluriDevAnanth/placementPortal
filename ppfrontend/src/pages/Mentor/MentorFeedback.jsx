import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import EditFeedback from "./components/EditFeedback";
import { isAfter, parseISO, format, addDays } from 'date-fns'
import { Button, Form, Table, Tab, Nav, FloatingLabel } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function MentorFeedback() {
  const { user, auth } = useContext(AuthCon);
  const { students, year } = useContext(MentorCon);
  const [edit, setEdit] = useState();
  const [PC, setPC] = useState();
  const [MR, setMR] = useState();
  const [activeTab, setActiveTab] = useState("individual");

  async function fetchPC() {
    const response = await fetch("http://localhost:3000/api/mentor/getPC", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    setPC(res.data);
  }

  async function fetchMR() {
    const response = await fetch(`http://localhost:3000/api/mentor/getMentorReview/${user.email}/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    setMR(res.data.reverse());
  }

  useEffect(() => {
    if (user && year) {
      fetchMR();
      fetchPC();
    }
  }, [user, year]);


  const subIndiFB = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }

    const response = await fetch('http://localhost:3000/api/mentor/uploadMFB/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ user, data: q, year: year.curr }),
    });

    const res = await response.json();
    await fetchMR();
  }

  const subGroupFB = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedCheckboxes = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
    const checkedValues = checkedCheckboxes.map((checkbox) => checkbox.value);
    q.rollno = checkedValues.join(',')
    console.log(q);
    const response = await fetch('http://localhost:3000/api/mentor/uploadMFB/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ user, data: q, year: year.curr }),
    });

    const res = await response.json();
    await fetchMR();
  }

  return (
    user !== null && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div className="position-sticky">
              <Sidebar />
            </div>
            <div className="flex-fill bg-white p-3 rounded-3 ms-3 border-primary me-3">
              <Tab.Container id="left-tabs-example" defaultActiveKey="individual">
                <Nav variant="pills" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="individual" style={activeTab === "individual" ? { backgroundColor: "#696747", color: "white" } : { color: 'black', backgroundColor: "#fff" }} onClick={() => setActiveTab("individual")} >
                      Individual
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="group" style={activeTab === "group" ? { backgroundColor: "#696747", color: "white" } :
                      { color: 'black', backgroundColor: "#fff" }} onClick={() => setActiveTab("group")} > Group
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="individual">
                    <Form className="d-flex flex-column gap-2" onSubmit={subIndiFB}>
                      <input type="text" name="reviewtype" value='individual' hidden readOnly />
                      <FloatingLabel controlId="formRollno" label="Select Mentee's Name">
                        <Form.Select name='rollno'>
                          {students && Object.values(students).map((q) => (
                            <option key={q.name} value={q.rollno}>{q.rollno} - {q.name}</option>
                          ))}
                        </Form.Select>
                      </FloatingLabel>
                      <div>
                        <Form.Check inline label="Student" name="person" type="radio" id="student" value="student" />
                        <Form.Check inline label="Parent" name="person" type="radio" id="parent" value="parent" />
                        <Form.Check inline label="Guardian" name="person" type="radio" id="guardian" value="guardian" />
                      </div>

                      <div className="d-flex gap-3">
                        <FloatingLabel className="flex-fill" controlId="formModeofcom" label="Works with selects">
                          <Form.Select name='modeofcom'>
                            <option value="General">General</option>
                            {PC && PC.map((row, i) => (
                              <option key={i} value={row.name}>
                                {row.dateofvisit === "0000-00-00" ? (
                                  `${row.name} - Tentative`
                                ) : (
                                  <>
                                    {row.name} -{" "}
                                    {new Date(row.dateofvisit).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </>
                                )}
                              </option>
                            ))}
                          </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel className="flex-fill" controlId="formMeetingTime" label="Choose the date of interaction">
                          <Form.Control type="date" name="meeting-time" required />
                        </FloatingLabel>
                      </div>
                      <FloatingLabel controlId="formMenreview" label="Description">
                        <Form.Control style={{ minHeight: "250px" }} as="textarea" rows={3} name="menreview" placeholder="Give a brief description" required />
                      </FloatingLabel>
                      <div  >
                        <Button variant="primary" type="submit">Submit</Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  <Tab.Pane eventKey="group">
                    <Form className="d-flex flex-column gap-2 floating-form" onSubmit={subGroupFB}  >
                      <input type="text" name="reviewtype" value='group' hidden readOnly />
                      <div className="container-fluid">
                        <div className="row">
                          {students && Object.values(students).map((student) => (
                            <Form.Check value={student.rollno} className="col" key={student.rollno} type="checkbox" id={student.rollno} label={`${student.name}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="d-flex gap-3">
                        <FloatingLabel className="flex-fill" controlId="formModeofcomGroup" label="Feedback About">
                          <Form.Select name='modeofcom'>
                            <option value="General">General</option>
                            {PC && PC.map((row, i) => (
                              <option key={i} value={row.name}>
                                {row.dateofvisit === "0000-00-00" ? (
                                  `${row.name} - Tentative`
                                ) : (
                                  <>
                                    {row.name} -{" "}
                                    {new Date(row.dateofvisit).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </>
                                )}
                              </option>
                            ))}
                          </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel className="flex-fill" controlId="formMeetingTimeGroup" label="Choose the date of interaction">
                          <Form.Control type="date" name="meeting-time" required />
                        </FloatingLabel>
                      </div>
                      <FloatingLabel controlId="formMenreviewGroup" label="Description">
                        <Form.Control style={{ minHeight: "250px" }} as="textarea" rows={3} name="menreview" required />
                      </FloatingLabel>
                      <div>
                        <Button variant="primary" type="submit">Submit</Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
          <div className="container-fluid mt-4">
            <div className="rounded-3">
              <div className="p-3">
                {students && <DataTable emptyMessage="No FeedBack found." sortMode="multiple" sortField="name" sortOrder={-1} removableSort showGridlines stripedRows paginator rows={25} rowsPerPageOptions={[50]} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" size={'small'} value={MR} filterDisplay="row">
                  <Column className="text-center" field="reviewtype" header="Type" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
                  <Column className="text-center" field="jodRole" header="Rollno/Register No" filter sortable showFilterMenu={false}
                    filterMatchMode="contains"
                    body={(data, props) => {
                      let rollnoContent = '';
                      if (data.reviewtype === 'group' && data.rollno) {
                        rollnoContent = data.rollno.split(',').map(rr => {
                          return students[rr]?.name;
                        }).join(', ');
                      } else if (data.rollno && students[data.rollno]) {
                        rollnoContent = students[data.rollno]?.name;
                      }
                      return <p>{rollnoContent}</p>;
                    }}
                  ></Column>
                  <Column className="text-center" field="contactperson" header="Contact Person" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
                  <Column className="text-center" field="modeofcom" header="Feedback About" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
                  <Column field="menreview" header="Description" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
                  <Column className="text-center" field="as" header="Interacted on date" filter sortable showFilterMenu={false} filterMatchMode="contains" body={(data, props) => { return <div>{format(parseISO(data.uploadeddate), 'yyyy-MM-dd')}</div> }}></Column>
                  <Column className="text-center" field="ss" header="Options" body={(data, props) => {
                    return <div><button className="btn" style={{ backgroundColor: "#696747", color: "white" }}
                      disabled={isAfter(new Date(), addDays(data.createdAt, 1))}
                      onClick={() => { setEdit(data); }}>Edit</button></div>
                  }}></Column>
                </DataTable>}
              </div>
            </div>
          </div>
          <div style={{ width: '30rem' }} className="d-flex justify-content-center">
            {edit && <EditFeedback edit={edit} MR={MR} setMR={setMR} setEdit={setEdit} />}
          </div>
        </div>
      </div>
    )
  );
}

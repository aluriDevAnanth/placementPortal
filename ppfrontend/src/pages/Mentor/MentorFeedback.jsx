import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import EditFeedback from "./components/EditFeedback";
import { isAfter, parseISO, format, addDays } from 'date-fns'

export default function MentorFeedback() {
  const { user, auth } = useContext(AuthCon);
  const { students, year } = useContext(MentorCon);
  const [edit, setEdit] = useState({});
  const [PC, setPC] = useState();
  const [MR, setMR] = useState();
  const mystyle = {
    backgroundColor: "#696747",
    color: "white",
  };

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
    //console.log(res.data);
  }

  useEffect(() => {
    if (user && year) {
      fetchMR(); fetchPC();
    }
  }, [user, year]);


  const subIndiFB = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }
    //console.log(q);
    const response = await fetch('http://localhost:3000/api/mentor/uploadMFB/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ user, data: q }),
    });

    const res = await response.json();
    //console.log(res);
  }

  const subGroupFB = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }
    //console.log(q);
    const response = await fetch('http://localhost:3000/api/mentor/uploadMFB/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ user, data: q }),
    });

    const res = await response.json();
    //console.log(q);
  }

  return (
    user !== null && (
      <div className="bodyBG">

        <div className="container-fluid">
          <div className="d-flex">
            <div className="position-sticky">
              <Sidebar />
            </div>
            <div className="flex-fill ms-3 border-primary me-3">
              <nav className="">
                <div
                  className="nav nav-tabs column-gap-1"
                  id="nav-tab"
                  role="tablist"
                >
                  <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target={`#individual`} type="button" role="tab" aria-controls={`individual`} aria-selected="true" style={mystyle} >
                    Individual
                  </button>
                  <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target={`#group`} type="button" role="tab" aria-controls={`group`} aria-selected="false" style={mystyle} >
                    Group
                  </button>
                </div>
              </nav>
              <div className="tab-content container me-5 border-dark p-3" id="nav-tabContent" >
                <div className="tab-pane fade show active" id={`individual`} role="tabpanel" aria-labelledby="nav-home-tab" tabIndex="0">
                  <p className="fs-4">Individual</p>
                  <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active p-4 shadow bg-white rounded" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                      {students ? (
                        <form onSubmit={subIndiFB}>
                          {/*  */}
                          <input type="text" name="reviewtype" value='individual' hidden readOnly />
                          <div className="form-floating mb-3">
                            <select name='rollno' className="form-select" id="floatingSelect" aria-label="Floating label select example">
                              {students.map((q) => {
                                return (
                                  <option key={q.rollno} value={q.rollno}>
                                    {q.rollno} - {q.name}
                                  </option>
                                );
                              })}
                            </select>
                            <label htmlFor="floatingSelect">Select Mentee's Name</label>
                          </div>
                          {/*  */}
                          <div className="form-check form-check-inline mb-3 ">
                            <input type="radio" className="form-check-input" id="person" name="person" defaultValue="student" />
                            <label className="form-check-label" htmlFor="Student">Student</label>
                          </div>
                          <div className="form-check form-check-inline mb-3 ">
                            <input type="radio" className="form-check-input" id="person" name="person" defaultValue="parent" />
                            <label className="form-check-label" htmlFor="Parent">
                              Parent
                            </label>
                          </div>
                          <div className="form-check form-check-inline mb-3 ">
                            <input type="radio" className="form-check-input" id="person" name="person" defaultValue="guardian" />
                            <label className="form-check-label" htmlFor="Guardian">Guardian</label>
                          </div>
                          {/*  */}
                          <div className="form-floating mb-3 ">
                            <select name='modeofcom' className="form-select" id="floatingSelect" aria-label="Floating label select example">
                              <option value="General">General</option>
                              {PC ? PC.map((row, i) => (
                                <option key={i} value={row.name}>
                                  {row.dateofvisit === "0000-00-00" ? (
                                    `${row.name} - Tentative`
                                  ) : (
                                    <>
                                      {row.name} -{" "}
                                      {new Date(
                                        row.dateofvisit
                                      ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </>
                                  )}
                                </option>
                              )) : <></>}
                            </select>
                            <label htmlFor="floatingSelect">Works with selects</label>
                          </div>
                          {/*  */}
                          <div className="form-floating mb-3">
                            <textarea className="form-control" id="menreview" name="menreview" placeholder="Give a brief description" required="required" defaultValue={""} style={{ height: '100px' }} />
                            <label htmlFor="menreview">Description</label>
                          </div>
                          {/*  */}
                          <div className="d-flex form-group mb-3">
                            <label htmlFor="meeting-time" className="w-100 form-check-label me-3" style={{ fontSize: 20, padding: 0, margin: 0, fontWeight: 500, }} >Choose the date of interaction</label>
                            <input type="date" className="form-control form-control-inline" id="meeting-time" name="meeting-time" required="" />
                          </div>
                          {/*  */}
                          <button className="btn btn-success" value="individual" id="typeofsubmit" name="typeofsubmit" > Submit </button>
                        </form>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
                {students && <div
                  className="tab-pane fade hide"
                  id={`group`}
                  role="tabpanel"
                  aria-labelledby="nav-home-tab"
                  tabIndex="0"
                >
                  <p className="fs-4">Group</p>
                  <div className="tab-pane fade p-4 shadow bg-white rounded active show" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    <form onSubmit={subGroupFB} className="floating-form">
                      <input type="text" name="reviewtype" value='group' hidden readOnly />
                      <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="menteesno" name="menteesno" placeholder="Enter No of Mentees" />
                        <label htmlFor="menteesno">No of Mentees</label>
                        <small id="emailHelp" className="form-text text-muted">Example: 1,2,3,4</small>
                      </div>

                      <div className="form-floating mb-3">
                        <select name='modeofcom' className="form-select" id="floatingSelect" aria-label="Floating label select example">
                          <option value="General">General</option>
                          {PC && PC.map((row, i) => (
                            <option key={i} value={row.name}>
                              {row.dateofvisit === "0000-00-00" ? (
                                `${row.name} - Tentative`
                              ) : (
                                <>
                                  {row.name} -{" "}
                                  {new Date(
                                    row.dateofvisit
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </>
                              )}
                            </option>
                          ))}
                        </select>
                        <label className="form-check-label" htmlFor="modecom" >Feedback About</label>
                      </div>


                      <div className="form-floating mb-3">
                        <textarea className="form-control" id="menreview" name="menreview" required="required" style={{ height: '100px' }}></textarea>
                        <label htmlFor="menreview">Description</label>
                      </div>

                      <div className="d-flex form-group mb-3">
                        <label
                          htmlFor="meeting-time"
                          className="w-100 form-check-label me-3"
                          style={{
                            fontSize: 20,
                            padding: 0,
                            margin: 0,
                            fontWeight: 500,
                          }}
                        >
                          Choose the date of interaction
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-inline"
                          id="meeting-time"
                          name="meeting-time"
                          required=""
                        />
                      </div>

                      <button className="btn btn-success" value="group" id="typeofsubmit" name="typeofsubmit">Submit</button>
                    </form>
                  </div>
                </div>}
              </div>
            </div>
          </div>
          <div className="container-fluid mt-4">
            <div className="rounded-3">
              <table className="shadow table table-striped table-bordered table-hover" style={mystyle}>
                <tbody style={mystyle}>
                  <tr className="text-center text-light" style={mystyle}>
                    <th>Type</th>
                    <th>Rollno/Register No</th>
                    <th>Contact Person</th>
                    <th>Feedback About</th>
                    <th>Description</th>
                    <th>Interacted on date</th>
                    <th>Options</th>
                  </tr>
                  {MR &&
                    MR.map(q => {
                      return <tr key={q._id}>
                        <td>{q.reviewtype}</td>
                        <td>{q.rollno}</td>
                        <td>{q.contactperson}</td>
                        <td>{q.modeofcom}</td>
                        <td>{q.menreview}</td>
                        {q.uploadeddate ? <td>{format(parseISO(q.uploadeddate), 'yyyy-MM-dd')}</td> : <td></td>}
                        <td>
                          <button disabled={isAfter(new Date(), addDays(q.uploadeddate, 1))} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setEdit(q); }} style={mystyle} className="btn" type="submit" id="edit" name="edit" value={q._id}>Edit</button>
                        </td>
                      </tr>
                    })
                  }
                </tbody>
              </table>

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

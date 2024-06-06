import React, { useEffect, useState, useContext } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';

export default function StudentAtt() {
  const { auth, user } = useContext(AuthCon);
  const [att, setAtt] = useState();
  const [totalAtt, setTotalAtt] = useState();
  const [eventAtt, setEventAtt] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchAtt();
    fetchEventAtt();
  }, [user.rollno]);

  const fetchEventAtt = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/student/getEventAtt/${user.rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json(); console.log(res.data.att);
      setEventAtt(res.data.att);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchAtt = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/student/getAtt/${user.rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      setAtt(res.data.att);
      //console.log(res.data.att);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const calculateOverallAttendancePercentage = (attendanceData) => {
    let totalDays = 0;
    let presentDays = 0;

    totalDays += attendanceData.length;
    presentDays = attendanceData.filter(item => item.attendence === 'present').length;

    return totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  };

  useEffect(() => {
    if (att) { const q = calculateOverallAttendancePercentage(att).toFixed(2); setTotalAtt(q); /* console.log(q); */ }
  }, [att])

  useEffect(() => {
    if (att && show) {
      var table = $('#exatt').DataTable({
        orderCellsTop: true, destroy: true,
        initComplete: function () {
          $('#exatt thead tr:eq(1) th.text_search').each(function () {
            var title = $(this).text();
            $(this).html(`<input type="text" placeholder="Search ${title}" class="form-control column_search" />`);
          });

        }
      });
      $('#exatt thead').on('keyup', ".column_search", function () {
        table
          .column($(this).parent().index())
          .search(this.value)
          .draw();
      });
    }
  }, [att, show]);

  let allAtt;
  return (
    user !== null && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div className="">
              <Sidebar />
            </div>
            <div className="flex-fill ms-3 border-primary me-3 rounded-4 p-3">
              <Tabs defaultActiveKey="general" id="uncontrolled-tab-example"  >
                <Tab className="p-3" eventKey="general" title="General">
                  {att && <div className="mb-3">
                    {att && <p className={`${totalAtt >= 80 ? 'text-success' : 'text-danger'} fs-4 fw-bold`}>Overall Attendance: {totalAtt}%</p>}
                  </div>}
                  <div className="mb-3">
                    <button onClick={() => { setShow(!show) }} className="btn btn-primary">Toggle to all attendance</button>
                  </div>
                  {att && <div hidden={!show}>
                    <Table id='exatt' striped bordered hover>
                      <thead>
                        <tr className="text-center">
                          <th>Daily</th>
                          <th>Date</th>
                          <th>Attendance Status</th>
                        </tr>
                        <tr className="text-center">
                          <th className="text_search">Daily</th>
                          <th className="text_search">Date</th>
                          <th className="text_search">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {att.reverse().map((day, index) => (
                          <tr className="text-center" key={index}>
                            <td>{index + 1}</td>
                            <td> {day.date} </td>
                            <td className={`${day.attendence === 'present' ? 'text-success' : "text-danger"} fw-bolder`}>{day.attendence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>}
                </Tab>
                <Tab className="p-3" eventKey="event" title="Events">
                  <Accordion alwaysOpen>
                    {eventAtt && eventAtt.map(q => {
                      let i = 0; const t = Object.keys(q.attendance).length;
                      Object.keys(q.attendance).map(qq => {
                        if (q.attendance[qq].includes(user.rollno)) i = i + 1;
                      })
                      return <Accordion.Item key={q.name} eventKey={q.name}>
                        <Accordion.Header>{q.name} - {((i / t) * 100).toFixed(2)} Precentage  </Accordion.Header>
                        <Accordion.Body>
                          <p className="p-6">des: {q.des}</p>
                          <p className="p-6">startTime: {q.startTime}</p>
                          <p className="p-6">endTime: {q.endTime}</p>
                          <p className="p-6">rec : {q.rec}</p>
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Attendence</th>
                              </tr>
                            </thead>
                            <tbody>
                              {q.attendance && Object.keys(q.attendance).map(qq => {
                                console.log(qq);
                                return (
                                  <tr key={qq}>
                                    <td>{qq}</td>
                                    <td>{q.attendance[qq].includes(user.rollno) ? 'Present' : 'Absent'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    })}
                  </Accordion>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

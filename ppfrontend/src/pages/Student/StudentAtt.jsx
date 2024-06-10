import React, { useEffect, useState, useContext } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';

export default function StudentAtt() {
  const { auth, user } = useContext(AuthCon);
  const [att, setAtt] = useState([]);
  const [totalAtt, setTotalAtt] = useState(0);
  const [eventAtt, setEventAtt] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = process.env.BASE_URL

  useEffect(() => {
    if (user.rollno) {
      fetchAtt();
      fetchEventAtt();
    }
  }, [user.rollno]);

  const fetchEventAtt = async () => {
    try {
      const response = await fetch(`${baseURL}/student/getEventAtt/${user.rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      setEventAtt(res.data.att);
    } catch (error) {
      setError('Error fetching event attendance');
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchAtt = async () => {
    try {
      const response = await fetch(`${baseURL}/student/getAtt/${user.rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      setAtt(res.data.att);
    } catch (error) {
      setError('Error fetching attendance');
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallAttendancePercentage = (attendanceData) => {
    let totalDays = attendanceData.length;
    let presentDays = attendanceData.filter(item => item.attendance === 'present').length;
    return totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  };

  useEffect(() => {
    if (att.length > 0) {
      const q = calculateOverallAttendancePercentage(att).toFixed(2);
      setTotalAtt(q);
    }
  }, [att]);

  useEffect(() => {
    if (att.length > 0 && show) {
      const table = $('#exatt').DataTable({
        orderCellsTop: true,
        destroy: true,
        initComplete: function () {
          $('#exatt thead tr:eq(1) th.text_search').each(function () {
            const title = $(this).text();
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    user && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <Sidebar />
            <div className="flex-fill ms-3 border-primary me-3 rounded-4 p-3">
              <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
                <Tab className="p-3" eventKey="general" title="General">
                  {att.length > 0 && (
                    <div className="mb-3">
                      <p className={`${totalAtt >= 80 ? 'text-success' : 'text-danger'} fs-4 fw-bold`}>Overall Attendance: {totalAtt}%</p>
                    </div>
                  )}
                  <div className="mb-3">
                    <button onClick={() => setShow(!show)} className="btn btn-primary">Toggle to all attendance</button>
                  </div>
                  {att.length > 0 && show && (
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
                        {att.slice().reverse().map((day, index) => (
                          <tr className="text-center" key={index}>
                            <td>{index + 1}</td>
                            <td>{day.date}</td>
                            <td className={`${day.attendance === 'present' ? 'text-success' : 'text-danger'} fw-bolder`}>{day.attendance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>
                <Tab className="p-3" eventKey="event" title="Events">
                  <Accordion alwaysOpen>
                    {eventAtt && eventAtt.map(event => {
                      let presentCount = 0;
                      const totalDays = Object.keys(event.attendance).length;
                      Object.keys(event.attendance).forEach(date => {
                        if (event.attendance[date].includes(user.rollno)) presentCount++;
                      });
                      return (
                        <Accordion.Item key={event.name} eventKey={event.name}>
                          <Accordion.Header>{event.name} - {((presentCount / totalDays) * 100).toFixed(2)}%</Accordion.Header>
                          <Accordion.Body>
                            <p>Des: {event.des}</p>
                            <p>StartTime: {event.startTime}</p>
                            <p>EndTime: {event.endTime}</p>
                            <p>Rec: {event.rec}</p>
                            <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Attendance</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(event.attendance).map(date => (
                                  <tr key={date}>
                                    <td>{date}</td>
                                    <td>{event.attendance[date].includes(user.rollno) ? 'Present' : 'Absent'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      );
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

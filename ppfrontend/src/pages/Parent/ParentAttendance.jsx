import React, { useEffect, useState } from "react";
import Sidebar from "./components/ParentSidebar";
import AuthCon from "../../context/AuthPro";
import { useContext } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

export default function ParentAttendance() {
  const { auth, user } = useContext(AuthCon);
  const [att, setAtt] = useState()

  const fetchAtt = async () => {
    console.log(1);
    const response = await fetch(`http://localhost:3000/api/student/getAtt/${user.rollno}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setAtt({ ...res.data.att[user.rollno] });
    console.log(res.data.att[user.rollno]);
  };

  useEffect(() => {
    fetchAtt();
  }, [user.rollno])

  const calculateAttendancePercentage = (data) => {
    let filteredData = data;
    const totalDays = filteredData.length;
    const presentDays = filteredData.filter(item => item.attendence === 'present').length;

    return (presentDays / totalDays) * 100;
  };

  return (
    user !== null && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div className="">
              <Sidebar />
            </div>
            <div className="flex-fill ms-3 border-primary me-3 bg-white rounded-4 p-3">
              {att && <Tabs defaultActiveKey="Technical" id="uncontrolled-tab-example" className="mb-3" >
                <Tab className="ps-3" eventKey="Technical" title="Technical">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Week</th>
                        <th>Date</th>
                        <th>Weekly Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(att.technical).reverse().map((week, index) => (
                        <tr key={index}>
                          <td>{week}</td>
                          <td>
                            {att.technical[week].map(item => (
                              <span key={item.date}  >
                                {item.date} (<span style={{ color: item.attendence === 'absent' ? 'red' : 'green' }}>{item.attendence}</span>)
                                {att.technical[week].indexOf(item) !== att.technical[week].length - 1 && ', '}
                              </span>
                            ))}
                          </td>
                          <td>{calculateAttendancePercentage(att.technical[week])}%</td>
                        </tr>
                      ))}

                    </tbody>
                  </Table>
                </Tab>
                <Tab className="ps-3" eventKey="Domain" title="Domain">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Week</th>
                        <th>Date</th>
                        <th>Weekly Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(att.domain).reverse().map((week, index) => (
                        <tr key={index}>
                          <td>{week}</td>
                          <td>
                            {att.domain[week].map(item => (
                              <span key={item.date}>
                                {item.date} (<span style={{ color: item.attendence === 'absent' ? 'red' : 'green' }}>{item.attendence}</span>)
                                {att.domain[week].indexOf(item) !== att.domain[week].length - 1 && ', '}
                              </span>
                            ))}
                          </td>
                          <td>{calculateAttendancePercentage(att.domain[week])}%</td>
                        </tr>
                      ))}


                    </tbody>
                  </Table>
                </Tab>
              </Tabs>}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

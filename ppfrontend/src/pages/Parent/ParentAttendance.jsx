import React, { useEffect, useState, useContext } from "react";
import Sidebar from "./components/ParentSidebar";
import AuthCon from "../../context/AuthPro";
import Table from 'react-bootstrap/Table';

export default function StudentAtt() {
  const { auth, user } = useContext(AuthCon);
  const [att, setAtt] = useState();
  const [totalAtt, setTotalAtt] = useState();
  const [show, setShow] = useState(false);
  const baseURL = process.env.BASE_URL

  useEffect(() => {
    fetchAtt();
  }, [user.rollno]);

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
            <div className="flex-fill ms-3 border-primary me-3   rounded-4 p-3">
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
            </div>
          </div>
        </div>
      </div>
    )
  );
}

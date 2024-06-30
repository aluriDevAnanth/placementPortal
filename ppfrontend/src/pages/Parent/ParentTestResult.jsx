import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/ParentSidebar'
import AuthCon from '../../context/AuthPro';

export default function ParentTestResult() {
  const { user, auth } = useContext(AuthCon);
  const [schedule, setSchedule] = useState()
  const baseURL = process.env.BASE_URL

  const mystyle = {
    backgroundColor: "#696747",
    color: "white",
  };

  async function fetchSchedule() {
    const response = await fetch(`${baseURL}/mentor/getSchedule/${user.yearofpassing}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rollno: [user.rollno] })
    });

    const res = await response.json();
    //console.log(res)
    setSchedule(res.data)
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  useEffect(() => {
    if (schedule) {
      var table = $('#exmyper').DataTable({
        orderCellsTop: true, destroy: true,
        initComplete: function () {
          $('#exmyper thead tr:eq(1) th.text_search').each(function () {
            var title = $(this).text();
            $(this).html(`<input type="text" placeholder="${title}" class="form-control column_search" />`);
          });

        }
      });
      $('#exmyper thead').on('keyup', ".column_search", function () {
        table
          .column($(this).parent().index())
          .search(this.value)
          .draw();
      });
    }
  }, [schedule]);


  return (
    user !== null && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div className="">
              <Sidebar />
            </div>
            {schedule && <div className="flex-fill ms-3 border-primary me-3">
              <table id="exmyper" className="shadow table table-striped table-bordered  table-hover">
                <thead>
                  <tr className="text-center" style={mystyle}>
                    <th>Tests </th>
                    <th>Aptitude </th>
                    <th>Coding </th>
                    <th>Others </th>
                    <th>Date</th>
                  </tr>
                  <tr className="text-center" style={mystyle}>
                    <th className='text_search'>Tests </th>
                    <th className='text_search'>Aptitude </th>
                    <th className='text_search'>Coding </th>
                    <th className='text_search'>Others </th>
                    <th className='text_search'>Date</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {schedule.map((q, i) => {
                    return <tr key={i} className="text-center">
                      <td>{q.testno}</td>
                      <td>{q.testno}</td>
                      <td>{q.testno}</td>
                      <td>{q.testno}</td>
                      <td>{q.date}</td>
                    </tr>
                  })}
                </tbody> */}
              </table>
            </div>}
          </div>
        </div>
      </div >
    )
  );
}

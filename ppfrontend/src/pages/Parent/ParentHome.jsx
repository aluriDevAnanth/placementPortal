import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './components/ParentSidebar';
import Table from 'react-bootstrap/Table';
import AuthCon from '../../context/AuthPro';

export default function StudentHome() {
  const { auth, user } = useContext(AuthCon);
  const [com, setCom] = useState([]);

  useEffect(() => {
    if (user.batch) fetchCom();
  }, [user.batch]);

  async function fetchCom() {
    try {
      const response = await fetch(`http://localhost:3000/api/student/getCom/${user.batch}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      let q = [];
      let w = [];
      res.data.forEach(qq => {
        if (qq.arrival === 'expected') {
          q.push(qq);
        } else {
          w.push(qq);
        }
      });
      //console.log(w);
      setCom([q, w]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if (com[1]) {
      var table = $('#example').DataTable({
        orderCellsTop: true, destroy: true,
        initComplete: function () {
          $('#example thead tr:eq(1) th.text_search').each(function () {
            var title = $(this).text();
            $(this).html(`<input type="text" placeholder="Search ${title}" class="form-control column_search" />`);
          });

        }
      });
      $('#example thead').on('keyup', ".column_search", function () {
        table
          .column($(this).parent().index())
          .search(this.value)
          .draw();
      });
    }
  }, [com[1]]);

  return (
    <div className='container-fluid d-flex'>
      <div>
        <Sidebar />
      </div>
      <div className='flex-fill container-fluid'>
        <div className='bg-white p-3 rounded-3 mb-3'>
          <p className='fs-5 fw-bold text-center'>Announcement</p>
          <p><span className='fw-bold'>NOTE:</span> Students you may refer to the detailed attendance for further clarifications on above consolidated attendance, we have not considered Barclays attendance for computing weekly attendance. Also students are marked as "present" only if they have spent minimum of 80% time in the session. Students who have not met 80% in weekly attendance will not be allowed into placement process.</p>
        </div>
        <div>
          <Table id='example' striped bordered hover size="sm">
            <thead>
              <tr className='text-center'>
                <th> #</th>
                <th>Expected Company Name</th>
                <th>Type Of Company</th>
                <th>Eligible Branch</th>
                <th>Expected Date</th>
              </tr>
              <tr className='text-center'>
                <th className="text_search"> #</th>
                <th className="text_search">Expected Company Name</th>
                <th className="text_search">Type Of Company</th>
                <th className="text_search">Eligible Branch</th>
                <th className="text_search">Expected Date</th>
              </tr>
            </thead>
            <tbody>
              {com[1] && com[1].map((q, i) => (
                <tr className='text-center' key={i}>
                  <td>{i + 1}</td>
                  <td>{q.name}</td>
                  <td>{q.category}</td>
                  <td>CSE</td>
                  <td>{q.dateofvisit}</td>
                </tr>
              ))}
            </tbody>

          </Table>
        </div>
      </div>
    </div>
  );
}

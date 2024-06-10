import React, { useContext, useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'
import Search from './components/Search'
import Table from 'react-bootstrap/Table';
import MentorCon from '../../context/MentorPro'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function MentorHome() {
  const { students, year } = useContext(MentorCon)
  const { user, auth } = useContext(AuthCon)
  const [com, setCom] = useState([]);
  const baseURL = process.env.BASE_URL

  useEffect(() => {
    if (year.curr) fetchCom();
  }, [year, year.curr]);

  async function fetchCom() {
    try {
      const response = await fetch(`${baseURL}/student/getCom/${year.curr}`, {
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

  const mystyle = {
    backgroundColor: "#696747 !important",
  };


  return (
    user && <div className='bodyBG'>
      <div className='container-fluid'>
        <div className='d-flex'>
          <div className='me-3'>
            <Sidebar />
          </div>
          <div className='flex-fill container-fluid'>
            <div className='bg-white p-3 rounded-3 mb-3'>
              <p className='fs-5 fw-bold text-center'>Announcement</p>
              <p><span className='fw-bold'>NOTE:</span> Students you may refer to the detailed attendance for further clarifications on above consolidated attendance, we have not considered Barclays attendance for computing weekly attendance. Also students are marked as "present" only if they have spent minimum of 80% time in the session. Students who have not met 80% in weekly attendance will not be allowed into placement process.</p>
            </div>
            {<Search mystyle={mystyle} students={students} />}
            <div className='bg-white p-3 rounded-3 mt-3'>
              <p className='fs-3 fw-bold  '>Excepted Companies</p>
              <DataTable value={com[1]} className="p-datatable-striped p-datatable-hover text-center" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort filterDisplay="row" emptyMessage="No Company found." >
                <Column className='text-center' field="name" header="Expected Company Name" sortable filter filterMatchMode="contains" />
                <Column className='text-center' field="category" header="Type Of Company" sortable filter filterMatchMode="contains" />
                <Column className='text-center' field="branch" header="Eligible Branch" sortable filter filterMatchMode="contains" />
                <Column className='text-center' field="dateofvisit" header="Expected Date" sortable filter filterMatchMode="contains" />
              </DataTable>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

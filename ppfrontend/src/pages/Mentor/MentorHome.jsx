import React, { useContext, useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'
import Search from './components/Search'
import MentorCon from '../../context/MentorPro'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format, isAfter, isBefore, parseISO } from 'date-fns'

export default function MentorHome() {
  const { students, year } = useContext(MentorCon)
  const { user, auth } = useContext(AuthCon)
  const [com, setCom] = useState([]);
  const baseURL = process.env.BASE_URL
  const [ann, setAnn] = useState()

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
      res.data.forEach(qq => {
        if (isBefore(new Date(), parseISO(qq.dateOfVisit))) {
          q.push(qq);
        }
      });
      setCom(q);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const mystyle = {
    backgroundColor: "#696747 !important",
  };

  useEffect(() => {
    if (year.curr) fetchAnn();
  }, [year.curr])

  const fetchAnn = async () => {
    const response = await fetch(`${baseURL}/student/getAnn/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setAnn(res.data.ann)
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
              <p> {ann && ann.des}</p>
            </div>
            {<Search mystyle={mystyle} students={students} />}
            <div className='bg-white p-3 rounded-3 mt-3'>
              <p className='fs-3 fw-bold  '>Excepted Companies</p>
              <DataTable value={com} className="p-datatable-striped p-datatable-hover text-center" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort filterDisplay="row" emptyMessage="No Company found." >
                <Column className='text-center' field="name" header="Expected Company Name" sortable filter filterMatchMode="contains" />
                <Column className='text-center' field="category" header="Type Of Company" sortable filter filterMatchMode="contains" />
                <Column className='text-center' field="branches" header="Eligible Branch" sortable filter filterMatchMode="contains" body={data => <p>{data.branches.join(', ')}</p>} />
                <Column className='text-center' field="dateOfVisit" header="Expected Date" sortable filter filterMatchMode="contains"
                  body={data => <p>{format(parseISO(data.dateOfVisit), 'dd-MM-yyyy')}</p>} />
              </DataTable>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

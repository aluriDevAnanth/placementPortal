import React, { useContext, useState, useEffect, useRef } from 'react';
import AuthCon from '../../context/AuthPro';
import Sidebar from './components/Sidebar';
import AdminCon from '../../context/AdminPro'
import { Toast } from 'primereact/toast';
import { format, parseISO } from 'date-fns'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Announcements() {
  const { auth } = useContext(AuthCon);
  const { stu, year, setStu } = useContext(AdminCon)
  const baseURL = process.env.BASE_URL
  const [ann, setAnn] = useState()

  const fetchAnn = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/getAnn/${year.curr}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      //console.log(res);
      setAnn(res.data.ann)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  async function postAnn(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const des = formData.get('ann');
    const response = await fetch(`${baseURL}/admin/postAnn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      }, body: JSON.stringify({ des, batch: year.curr }),
    });
    const res = await response.json();
    //console.log(res);
  }

  useEffect(() => {
    if (year?.curr) fetchAnn()
  }, [year?.curr])


  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container w-100'>
          <div className='bg-white p-3 rounded mb-4'>
            <p className='fs-3 fw-bold'>Add Announcements</p>
            <form className=' ' onSubmit={postAnn}>
              <p className='text-dark'> <span className='fw-bold'>NOTE:</span> This for mentor,students,parent only</p>
              <textarea className='form-control mb-3' name="ann" id="" cols="30" rows="10"></textarea>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>

          <div>
            {ann && <DataTable value={ann && ann.reverse()} reorderableColumns resizableColumns size='small' showGridlines stripedRows paginator rows={20} rowsPerPageOptions={[30, 50, 100, 200]} tableStyle={{ minWidth: '50rem' }} filterDisplay="row" emptyMessage="No Students found." removableSort >
              <Column field="des" header="Des" sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false}></Column>
              <Column header="Date" body={(data) => { return format(parseISO(data.createdAt), 'dd-MM-yyyy hh:mm aa'); }} sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false}></Column>
            </DataTable>}
          </div>
        </div>
      </div>
    </div>
  );
}

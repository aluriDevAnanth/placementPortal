import React, { useContext, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HODCon from '../../context/HODPro';
import Sidebar from './components/Sidebar';

export default function HODHome() {
  const { feed } = useContext(HODCon);
  const [count, setCount] = useState([]);

  useEffect(() => {
    try {
      if (feed && feed.length > 0) {
        const cseMentorReviews = feed.filter(review => review.mentordept === 'CSE');
        const mentorReviewsCount = cseMentorReviews.reduce((acc, review) => {
          acc[review.mentorname] = (acc[review.mentorname] || 0) + 1;
          return acc;
        }, {});
        setCount(Object.entries(mentorReviewsCount));
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [feed]);

  return (
    <div className='d-flex'>
      <div className='me-5'>
        <Sidebar />
      </div>
      <div className='flex-fill me-5'>
        <p className='fs-3 fw-bolder'>Mentor and No Of Reviews Per Mentor</p>
        {count && (
          <DataTable showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="0" sortOrder={1} removableSort value={count} className="p-datatable-striped" filterDisplay="row" emptyMessage="No Mentor found.">
            <Column field="0" header="Mentor Name" sortable filter filterMatchMode="contains" />
            <Column field="1" header="Total No of Reviews" sortable filter filterMatchMode="contains" />
          </DataTable>
        )}
      </div>
    </div>
  );
}

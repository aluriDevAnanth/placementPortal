import React, { useEffect, useState, useContext } from "react";
import Sidebar from "./components/ParentSidebar";
import AuthCon from "../../context/AuthPro";
import { parseISO, format } from 'date-fns'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const EventAttTable = ({ data }) => {
  console.log(data);
  return (
    <div className="p-3">
      <h5>Attendance for {data.name}</h5>
      <DataTable value={data.attendance} reorderableColumns resizableColumns size='small' showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[20, 50,]} tableStyle={{ minWidth: '50rem' }} filterDisplay="row" emptyMessage="No Dates found." removableSort sortField="per" sortOrder={-1}>
        <Column field="date" header="Date" sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false}></Column>
        <Column field="att" header="Attendance" sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false}></Column>
      </DataTable>
    </div>
  );
};

function AttTable({ eventAtt, user }) {
  const [expandedRows, setExpandedRows] = useState(null);
  let processedData = eventAtt.map(e => {
    let totalDates = Object.keys(e.attendance).length;
    let presentCount = 0;
    let attendanceDetails = [];

    Object.keys(e.attendance).forEach(date => {
      let isPresent = e.attendance[date].includes(user.rollno);
      if (isPresent) presentCount++;

      attendanceDetails.push({
        att: isPresent ? 'present' : 'absent', date
      });
    });

    return {
      ...e,
      startTime: format(parseISO(e.startTime), 'dd-MM-yyyy hh:mm aa'),
      endTime: format(parseISO(e.endTime), 'dd-MM-yyyy hh:mm aa'),
      per: `${((presentCount / totalDates) * 100).toFixed(2)}%`,
      attendance: attendanceDetails
    };
  });

  const rowExpansionTemplate = (data) => {
    return <EventAttTable data={data} />;
  };

  return (
    <div>
      <DataTable value={processedData} rowExpansionTemplate={rowExpansionTemplate} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} reorderableColumns resizableColumns size='small' showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} tableStyle={{ minWidth: '50rem' }} filterDisplay="row" emptyMessage="No Events found." removableSort sortField="per" sortOrder={-1}>
        <Column expander style={{ width: '3em' }} />
        <Column filter filterMatchMode="contains" className='text-center' showFilterMenu={false} sortable field="name" header="Name" />
        <Column filter filterMatchMode="contains" className='text-center' showFilterMenu={false} sortable field="des" header="Description" />
        <Column filter filterMatchMode="contains" className='text-center' showFilterMenu={false} sortable field="startTime" header="Start Time" />
        <Column filter filterMatchMode="contains" className='text-center' showFilterMenu={false} sortable field="endTime" header="End Time" />
        <Column filter filterMatchMode="contains" className='text-center' showFilterMenu={false} sortable field="rec" header="Recurrence" />
        <Column filter filterMatchMode="contains" className='text-center' showFilterMenu={false} sortable field="per" header="Attendance Percentage" />
      </DataTable>
    </div>
  );
}

export default function ParentAttendance() {
  const { auth, user } = useContext(AuthCon);
  const [totalEventAtt, setTotalEventAtt] = useState(0);
  const [eventAtt, setEventAtt] = useState([]);
  const [error, setError] = useState(null);
  const baseURL = process.env.BASE_URL

  useEffect(() => {
    if (eventAtt && eventAtt.length > 0) {
      let tot = 0;
      let presentCount = 0;
      eventAtt.forEach(event => {
        tot = tot + Object.keys(event.attendance).length;
        Object.keys(event.attendance).forEach(date => {
          if (event.attendance[date].includes(user.rollno)) presentCount++;
        });
      });

      setTotalEventAtt(presentCount / tot);
    }
  }, [eventAtt, user.rollno]);

  useEffect(() => {
    if (user.rollno) {
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    user && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div>
              <Sidebar />
            </div>
            <div className="flex-fill ms-3 border-primary me-3 rounded-4 p-3">
              <p className="fs-5">All over total event attendence: {isNaN(totalEventAtt) ? '0' : ((totalEventAtt) * 100).toFixed(2)}
                %</p>
              <AttTable eventAtt={eventAtt} user={user} />
            </div>
          </div>
        </div>
      </div>
    )
  );
}

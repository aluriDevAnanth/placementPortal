import React, { useContext, useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import MentorCon from '../../context/MentorPro';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';


export default function MenteeCompanyDashboard() {
  const { user, auth } = useContext(AuthCon);
  const { students, year } = useContext(MentorCon);
  const [company, setCompany] = useState();
  const [atStage, setAtStage] = useState();
  const [PP, setPP] = useState();
  const [disPP, setDisPP] = useState();
  const [expandedRows, setExpandedRows] = useState();
  const toast = useRef(null);
  const baseURL = process.env.BASE_URL

  async function fetchCompanies() {
    const response = await fetch(`${baseURL}/mentor/getComp/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setCompany(res.data.comp);
  }

  async function fetchStudentPlacementProgress() {
    const rollno = Object.keys(students);
    const response = await fetch(`${baseURL}/mentor/getStudentPlacementProgress/${year.curr}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
      body: JSON.stringify({ rollno }),
    });
    const res = await response.json();
    setPP(res.data);
  }

  useEffect(() => {
    if (PP && students) {
      //console.log(PP);
      let pp = Object.values(students).map((q, i) => {
        return {
          name: q.name,
          cgpa: q.cgpa,
          ec: PP?.eligibleCompany[q.rollno]?.length || 0,
          ac: PP?.appliedCompany[q.rollno]?.length || 0,
          sc: PP?.shortlistedCompany[q.rollno]?.length || 0,
          ot: PP.stages[q.rollno]?.ot?.length || 0,
          gd: PP.stages[q.rollno]?.gd?.length || 0,
          inter: PP.stages[q.rollno]?.inter?.length || 0,
          hr: PP.stages[q.rollno]?.hr?.length || 0,
          other: PP.stages[q.rollno]?.other?.length || 0,
          p: PP.placed[q.rollno]?.[0] ? "Placed" : "Not Placed",
          pc: PP.placed[q.rollno]?.[0]?.name || "-",
          pctc: PP.placed[q.rollno]?.[0]?.CTC || "-",
        }
      })
      setDisPP(pp)
    }
  }, [PP])


  useEffect(() => {
    if (students && year) {
      fetchStudentPlacementProgress();
      fetchCompanies();
    }
  }, [students, year])

  const onRowExpand = (event) => {
    toast.current.show({ severity: 'info', summary: 'Info Expanded', detail: event.data.name, life: 3000 });
  };

  const onRowCollapse = (event) => {
    toast.current.show({ severity: 'success', summary: 'Info Collapsed', detail: event.data.name, life: 3000 });
  };

  const allowExpansion = (rowData) => {
    return company;
  };

  const rowExpansionTemplate = (data) => {
    //console.log(company, atStage);
    let rollno = Object.values(students).find(ss => ss.name === data.name).rollno;
    //console.log(rollno);
    let pp = company.map((q, i) => {
      return {
        name: q.name,
        jodRole: q.jodRole,
        CTC: q.CTC,
        category: q.category,
        es: q.eligibleStudents.includes(rollno) ? "Yes" : "No",
        as: q.appliedStudents.includes(rollno) ? "Yes" : "No",
        ss: q.shortlistedStudents.includes(rollno) ? "Yes" : "No",
        mod: q.modeOfDrive,
        ot: q?.stages?.onlineTest?.[rollno],
        GD: q?.stages?.GD?.[rollno],
        inter: q?.stages?.interview?.[rollno],
        HR: q?.stages?.HR?.[rollno],
        other: q?.stages?.otherStages?.[rollno],
      }
    })
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;
    return (
      <div className="p-3">
        <h5>Orders for {data.name}</h5>
        <DataTable sortMode="multiple" sortField="name" sortOrder={-1} removableSort showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} size={'small'} value={pp} filterDisplay="row" emptyMessage="No Company found.">
          <Column field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="jodRole" header="Job Role" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="CTC" header="CTC" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="category" header="Category" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="es" header="Eligible Students" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="as" header="Applied Students" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="ss" header="Shortlisted Students" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="mod" header="Mode Of Drive" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="ot" header="Online Test" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="GD" header="GD" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="inter" header="Interview" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="HR" header="HR" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column field="other" header="Other Stages" filter sortable showFilterMenu={false} filterMatchMode="contains"></Column>
          <Column headerStyle={{ width: '4rem' }}  ></Column>
        </DataTable>
      </div>
    );
  };

  return (
    user !== null && (
      <div className='bodyBG'>
        <div className='container-fluid'>
          <div className='d-flex'>
            <div className=''>
              <Sidebar />
            </div>
            <div className='flex-fill ms-3 ' style={{ maxWidth: "100vw" }}>
              <Toast ref={toast} />
              {students && disPP && (
                <DataTable size={'small'} value={disPP} className="p-datatable-striped p-datatable-hover" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort sortMode="multiple" filterDisplay="row" emptyMessage="No Students found." expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}>
                  <Column expander={allowExpansion} style={{ width: '5rem' }} />
                  <Column field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="cgpa" header="CGPA" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="ec" header="Eligible Companies" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="ac" header="Applied Companies" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="sc" header="Shortlisted Companies" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="ot" header="Online Test" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="gd" header="GD" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="inter" header="Interview" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="hr" header="HR" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="other" header="Other Stages" filter sortable showFilterMenu={false} filterMatchMode="contains" />

                  <Column field="p" header="Placed" filter sortable filterMatchMode="contains" />

                  <Column field="pc" header="Placed Company" filter sortable filterMatchMode="contains" />

                  <Column field="pctc" header="Placed Company CTC" filter sortable filterMatchMode="contains" />

                </DataTable>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

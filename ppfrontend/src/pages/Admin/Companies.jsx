import React, { useContext, useState, useEffect, useRef } from 'react';
import AuthCon from '../../context/AuthPro';
import MentorCon from '../../context/MentorPro';
import Sidebar from './components/Sidebar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import AdminCon from '../../context/AdminPro'
import { Toast } from 'primereact/toast';
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';
import { Tooltip } from 'primereact/tooltip';
import { isAfter, parseISO, format, addDays } from 'date-fns'
import { Accordion, Button, Form, Table, Tab, Nav, FloatingLabel } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
const baseURL = process.env.BASE_URL

const ShortStu = ({ q, stus, students, ss }) => {
  const stu = q[ss] ? q[ss].map(rollno => students[rollno]) : [];

  //console.log(q, stus, students);

  return (
    <div>
      <DataTable size={'small'} value={stu} className="p-datatable-striped p-datatable-hover" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort filterDisplay="row" emptyMessage="No Company found." resizableColumns  >
        <Column field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains" />
        <Column field="rollno" header="rollno" filter sortable showFilterMenu={false} filterMatchMode="contains" />
        <Column field="email" header="email" filter sortable showFilterMenu={false} filterMatchMode="contains" />
      </DataTable>
    </div>
  );
};

function CompanyDetails({ comp, students, year }) {
  const { user, auth } = useContext(AuthCon);
  const toast = useRef(null);
  const [expandedRows, setExpandedRows] = useState();

  const onRowExpand = (event) => {
    toast.current.show({ severity: 'info', summary: 'Info Expanded', detail: event.data.name, life: 3000 });
  };

  const onRowCollapse = (event) => {
    toast.current.show({ severity: 'success', summary: 'Info Collapsed', detail: event.data.name, life: 3000 });
  };

  const allowExpansion = (rowData) => {
    return comp;
  };

  const rowExpansionTemplate = (q) => {
    return (
      students && <ListGroup>
        <ListGroup.Item>Job Role: {q.jobRole}</ListGroup.Item>
        <ListGroup.Item>CTC: {q.CTC}</ListGroup.Item>
        <ListGroup.Item>category: {q.category}</ListGroup.Item>
        <ListGroup.Item>batch: {q.batch}</ListGroup.Item>
        <ListGroup.Item>Eligible: {q.eligibleStudents.length}</ListGroup.Item>
        <ListGroup.Item>Applied: {q.appliedStudents.length}</ListGroup.Item>
        <ListGroup.Item> Date Of Visit:  {q.dateOfVisit ? format(parseISO(q.dateOfVisit), 'yyyy-MM-dd') : ''}</ListGroup.Item>
        <ListGroup.Item>
          <Accordion>
            {["eligibleStudents", "appliedStudents", "shortlistedStudents"].map(ss => {
              return <Accordion.Item key={ss} eventKey={ss}>
                <Accordion.Header> {ss} - {Object.values(q[ss]).length} Students </Accordion.Header>
                <Accordion.Body>
                  <ShortStu ss={ss} stus={q[ss]} q={q} students={students} />
                </Accordion.Body>
              </Accordion.Item>
            })}
          </Accordion>
        </ListGroup.Item>
        <ListGroup.Item> Placed Students: {q.placedStudents && q.placedStudents.map((studentId, i) => {
          const student = students[studentId];
          return student ? <span key={i}>{student.name}, </span> : null;
        })} </ListGroup.Item>
        <ListGroup.Item>Mode Of Drive: {q.modeOfDrive}</ListGroup.Item>
        <ListGroup.Item>Status Of Drive: {q.statusOfDrive}</ListGroup.Item>
        <ListGroup.Item>
          <p className='fs-4 fw-3'>Stages</p>
          {students && Object.keys(q.stages).map((stageCategory, index) => (
            <Accordion key={index} alwaysOpen>
              <Accordion.Header> {stageCategory} - Total {!(q.stages[stageCategory] === 'not applicable') ? Object.values(q.stages[stageCategory]).filter(q => q === 'cleared').length : q.stages[stageCategory]} members </Accordion.Header>
              <Accordion.Body>
                <StageStuTable q={q} students={students} stageCategory={stageCategory} />
              </Accordion.Body>
            </Accordion>
          ))}
        </ListGroup.Item>
      </ListGroup>
    );
  };

  return (
    user !== null && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div className="flex-fill rounded-3 ms-3 border-primary me-3">
              <Toast ref={toast} />
              <DataTable size={'small'} value={comp} className="p-datatable-striped p-datatable-hover" showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort filterDisplay="row" emptyMessage="No Company found." expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}>
                <Column expander={allowExpansion} style={{ width: '2rem' }} />
                <Column field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="dateOfVisit" header="Date Of Visit" filter sortable showFilterMenu={false} filterMatchMode="contains" body={(data, props) => { return <p> {format(parseISO(data.dateOfVisit), 'yyyy-MM-dd')}</p> }} />
                <Column field="modeOfDrive" header="Mode Of Drive" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="CTC" header="CTC" filter sortable showFilterMenu={false} filterMatchMode="contains" />
                <Column field="eligible" header="Eligible" filter sortable showFilterMenu={false} filterMatchMode="contains"
                  body={(data, props) => { return <p> {data.eligibleStudents.length}</p> }} />
                <Column field="applied" header="Applied" filter sortable showFilterMenu={false} filterMatchMode="contains"
                  body={(data, props) => { return <p> {data.appliedStudents.length}</p> }} />
                <Column field="shortlisted" header="Short Listed" filter sortable showFilterMenu={false} filterMatchMode="contains"
                  body={(data, props) => { return <p> {data.shortlistedStudents.length}</p> }} />
                {["onlineTest", "GD", "interview1", "HR", "otherStages"].map((col, i) => (
                  <Column key={col} field={col} header={col} body={(data, props) => { return <p> {!(data.stages[col] === 'not applicable') ? Object.values(data.stages[col]).filter(data => data === 'cleared').length : data.stages[col]}</p> }} />
                ))}
                <Column field="placedStudents" header="Final selected" filter sortable showFilterMenu={false} filterMatchMode="contains"
                  body={(data, props) => { return <p> {data.placedStudents ? data.placedStudents.length : '-'}</p> }} />
              </DataTable>
            </div>
          </div>
        </div>
      </div >
    )
  );
}

const StageStuTable = ({ q, students, stageCategory }) => {
  const data = Object.keys(q.stages[stageCategory]).map(rollNo => {
    const student = students[rollNo];
    return student ? {
      name: student.name,
      rollno: student.rollno,
      email: student.email,
      status: q.stages[stageCategory][rollNo]
    } : null;
  }).filter(item => item !== null);  // Filter out null values

  return (
    <DataTable value={data} showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} sortField="name" sortOrder={1} removableSort filterDisplay="row" emptyMessage="No Students found." resizableColumns reorderableColumns  >
      <Column className='text-center' field="name" header="Name" filter sortable showFilterMenu={false} filterMatchMode="contains" />
      <Column className='text-center' field="rollno" header="Roll No" filter sortable showFilterMenu={false} filterMatchMode="contains" />
      <Column className='text-center' field="email" header="Email" filter sortable showFilterMenu={false} filterMatchMode="contains" />
      <Column className='text-center' field="status" header="Status" filter sortable showFilterMenu={false} filterMatchMode="contains" />
    </DataTable>
  );
};


export default function Companies() {
  const { auth } = useContext(AuthCon);
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState();
  const { stu, year, setStu, comp } = useContext(AdminCon)
  const toast = useRef(null);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const dt = useRef(null);

  const columns = [
    { field: 'personalemail', header: 'personalemail' },
    { field: 'residence', header: 'residence' },
    { field: 'address', header: 'address' },
    { field: 'leetcode', header: 'leetcode' },
    { field: 'codechef', header: 'codechef' },
    { field: 'hackerrank', header: 'hackerrank' },
    { field: 'crcs', header: 'crcs' },
    { field: 'parentname', header: 'parentname' },
    { field: 'parentemail', header: 'parentemail' },
    { field: 'parentphone', header: 'parentphone' },
    { field: 'enrollmentstatus', header: 'enrollmentstatus' },
    { field: '10', header: '10' },
    { field: '12', header: '12' },
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${baseURL}/admin/addCompBulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      //console.log(res.data);
      setJsonData(res.data.jsonData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const onRowEditComplete = async (e) => {
    //console.log(11);
    let _products = [...stu];
    let { newData, index } = e;

    _products[index] = newData;
    //console.log(newData);
    setStu(_products);
    toast.current.show({ severity: 'success', summary: 'Student Info updated', detail: newData.name, life: 3000 });

    const response = await fetch(`${baseURL}/admin/editStu`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stu: newData }),
    });

    const res = response.json();
    //console.log(res.data);
  };

  const allowEdit = (rowData) => {
    return true;
  };

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
    setVisibleColumns(orderedSelectedColumns);
  };

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(stu);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'Students');
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });
        const fileName = 'Students';
        const EXCEL_EXTENSION = '.xlsx';
        const formattedDate = format(new Date(), 'dd-MM-yyyy_hh:mm');
        module.default.saveAs(data, `${fileName}_export_${formattedDate}${EXCEL_EXTENSION}`);
      }
    });
  };

  const header = <div className="d-flex justify-content-between align-items-center  gap-2">
    <FloatLabel className="mt-3"><MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} className="w-full sm:w-100rem" filter style={{ minWidth: "300px" }} display="chip" /> <label htmlFor="ms-cities">Select Columns</label></FloatLabel>
    <Button type="button" onClick={exportExcel} data-pr-tooltip="XLS" ><i className="bi bi-file-earmark-spreadsheet"></i> Export into Excel</Button>
  </div>;


  return (
    <div>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='ms-3 me-3 container w-100'>
          <h1>Companies Management Portal</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 d-flex column-gap-3 align-items-center">
              <label htmlFor="formFile" className="form-label">Upload file here to add students</label>
              <div className='flex-fill'>
                <input className="form-control" type="file" id="formFile" onChange={handleFileChange} accept=".xlsx, .xls" />
              </div>
              <Button type="submit" className="">Upload</Button>
            </div>
          </form>
          {/* <div>
            {jsonData && <pre>{console.log(jsonData)} {JSON.stringify(jsonData, null, 2)}</pre>}
          </div> */}
        </div>
      </div>
      {stu && comp && <div className='mt-3 container-fluid'>
        <p className='fs-3 fw-bold ms-4'>Companies</p>
        <Toast ref={toast} />
        <Tooltip target=".export-buttons>button" position="bottom" />
        <CompanyDetails comp={comp} students={stu} year={year} />
      </div>}
    </div>
  );
}

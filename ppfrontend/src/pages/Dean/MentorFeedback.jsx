import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DeanCon from '../../context/DeanPro';
import ExcelJS from 'exceljs';

export default function MentorFeedback() {
  const { feed, mentors } = useContext(DeanCon);
  const [filteredFeed, setFilteredFeed] = useState();
  const [comp, setComp] = useState();

  const exportToExcel = async () => {
    const rows = document.querySelectorAll('table tr');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Table Data');

    // Add the header row
    const headerRow = [];
    rows[0].querySelectorAll('th').forEach((cell) => {
      headerRow.push(cell.innerText);
    });
    worksheet.addRow(headerRow);

    // Add the data rows
    Array.from(rows).slice(1).forEach((row) => {
      const rowData = [];
      row.querySelectorAll('td').forEach((cell) => {
        rowData.push(cell.innerText);
      });
      worksheet.addRow(rowData);
    });

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'table_data.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (feed) {
      let uniqueComp = [...new Set(feed.map(item => item.modeofcom !== null && item.modeofcom))];
      uniqueComp = uniqueComp.filter(item => {
        return item !== false;
      });
      const sortedComp = uniqueComp.sort((a, b) => a.localeCompare(b));
      setComp(sortedComp);
    }
  }, [feed]);

  const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let q = {};

    for (let [key, value] of formData.entries()) {
      q[key] = value;
    }
    const { mentor, type, company } = q;

    const filteredData = feed.filter(item => (item.mentorname === mentor && item.reviewtype === type && item.modeofcom === company));

    setFilteredFeed(filteredData.reverse());
  };

  return (
    <div>
      <div className='d-flex'>
        <div className='me-3'>
          <Sidebar />
        </div>
        {feed && <div className='me-5'>
          <div className='d-flex'>
            <form onSubmit={handleSearch} className='d-flex'>
              <p className="fw-bold fs-3 me-2">Search</p>
              <div className='me-2'>
                {mentors && <select name='mentor' type="text" className='form-select' placeholder='Select Mentor Name' >
                  <option selected disabled value="">Select feedback type</option>
                  {mentors.map((q, i) => {
                    return <option key={i} value={q.name}>{q.name}</option>
                  })}
                </select>}
              </div>
              <div className='me-2'>
                <select name='type' type="text" className='form-select' placeholder='Select Mentor Name' >
                  <option selected disabled value="">Select feedback type</option>
                  <option value="individual">individual</option>
                  <option value="group">group</option>
                </select>
              </div>
              <div className='me-2'>
                {comp && <select name='company' defaultValue={'def'} type="text" className='form-select' placeholder='Select Mentor Name' >
                  <option selected value="def" disabled >Select feedback type</option>
                  {comp.map((q, i) => {
                    return <option key={i} value={q}>{q}</option>
                  })}
                </select>}
              </div>
              <div className='me-2'>
                <button type='submit' className="btn btn-primary">Submit</button>
              </div>
            </form>
            <div>
              <button onClick={exportToExcel} className="btn btn-success">Export</button>
            </div>
          </div>
          <div>
            <table className='table table-bordered table-striped table-hover'>
              <thead>
                <tr className="text-center">
                  <th>Mentor</th>
                  <th>Roll No</th>
                  <th>Contacted Person</th>
                  <th>Feedback About</th>
                  <th>Description</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeed &&
                  filteredFeed.map((q, i) => {
                    return <tr key={i} className="text-center">
                      <td>{q.mentorname}</td>
                      <td>{q.rollno}</td>
                      <td>{q.contactperson}</td>
                      <td>{q.modeofcom}</td>
                      <td>{q.menreview}</td>
                      <td>{q.timestm}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>
        </div>}
      </div>
    </div>
  );
}

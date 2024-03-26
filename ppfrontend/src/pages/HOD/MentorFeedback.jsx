import React, { useContext, useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import HODCon from '../../context/HODPro'
import * as XLSX from 'xlsx';

export default function MentorFeedback() {
  const { feed, mentors } = useContext(HODCon)
  const [filteredFeed, setFilteredFeed] = useState()
  const [comp, setComp] = useState()

  const exportToExcel = () => {
    const rows = document.querySelectorAll('table tr');
    const data = Array.from(rows).map(row => {
      const rowData = {};
      row.querySelectorAll('th, td').forEach((cell, index) => {
        rowData[`column${index + 1}`] = cell.innerText;
      });
      return rowData;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
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
        return item !== false /* && item !== 'Phone' &&
          item !== 'Email' &&
          item !== 'Whatsapp' &&
          item !== 'Other' && */
         /*  item !== 'In Person' */;
      });
      const sortedComp = uniqueComp.sort((a, b) => a.localeCompare(b));
      setComp(sortedComp)
      //console.log(comp)
    }
  }, [feed])


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
    //console.log(q, filteredData)
  }


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
                  <option selected disabled value="">Select teacher </option>
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
                  <option selected value="def" disabled >Select Company</option>
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
                      <th>{q.mentorname}</th>
                      <th>{q.rollno}</th>
                      <th>{q.contactperson}</th>
                      <th>{q.modeofcom}</th>
                      <th>{q.menreview}</th>
                      <th>{q.timestm}</th>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>
        </div>}
      </div>
    </div>
  )
}

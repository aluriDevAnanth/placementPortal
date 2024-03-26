import React, { useContext, useState } from 'react'
import MentorCon from "../../context/MentorPro";
import Sidebar from './components/Sidebar'
import AuthCon from '../../context/AuthPro'

export default function MenteeSearch() {
  const { students } = useContext(MentorCon);
  const [stu, setStu] = useState()

  const handleSearch = (e) => {
    e.preventDefault();
    let searchTerm = e.target[0].value;
    if (searchTerm !== '') {
      let filteredStudents = students.filter(q => q.rollno.includes(searchTerm));
      setStu(filteredStudents);
    }
  };

  return (
    <div className='bodyBG'>

      <div className='container-fluid'>
        <div className='d-flex'>
          <div className='me-3'>
            <Sidebar />
          </div>
          {students && <div className='flex-fill'>
            <form onSubmit={handleSearch}>
              <div className="row g-3 align-items-center">
                <div className="col-auto">
                  <label htmlFor="rollno" className="col-form-label">Student Search</label>
                </div>
                <div className="col-auto">
                  <input type="text" name='rollno' id="rollno" className="form-control" aria-describedby="passwordHelpInline" />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </div>
            </form>

            <div className='mt-3'>
              <table className='shadow table table-striped table-bordered mt-3'>
                <tbody>
                  <tr className="text-center text-light" style={{ backgroundColor: "#696747" }}>
                    <th scope="col">Rollno</th>
                    <th scope="col">Name</th>
                    <th scope="col">Branch</th>
                    <th scope="col">Course</th>
                    <th scope="col">Mentor</th>
                  </tr>
                  {stu && stu.map(q => {
                    return <tr className="text-center" key={q.rollno}>
                      <th scope="col">{q.rollno}</th>
                      <th scope="col">{q.name}</th>
                      <th scope="col">{q.branch}</th>
                      <th scope="col">{q.course}</th>
                      <th scope="col">{q.mentor}</th>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  )
}

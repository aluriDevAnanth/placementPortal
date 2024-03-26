import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import DeanCon from '../../context/DeanPro'
import MenteesListSearch from './components/MenteesListSearch'


export default function MenteesList() {
  const { year, stu, mentors } = useContext(DeanCon)
  const [filteredStudents, setFilteredStudents] = useState()

  useEffect(() => {
    setFilteredStudents(stu)
  }, [stu])


  const filterStu = (e) => {
    e.preventDefault();
    const selectedMentor = document.getElementById('mentor').value;
    const selectedYear = document.getElementById('year').value;

    const q = stu.filter(student => {
      return student.mentor === selectedMentor && student.batch === selectedYear;
    });
    setFilteredStudents(q);
  }

  return (
    <div>
      <div className='d-flex'>
        <div className='me-3'>
          <Sidebar />
        </div>
        <div className='flex-fill me-3'>
          {mentors && <div className='flex-fill'>
            <form onSubmit={filterStu} className='d-flex'>
              <p className='fw-bolder fs-4 me-3' >Search</p>
              <div className='me-3'>
                <select className='form-select' defaultValue="" name="mentor" id="mentor">
                  {mentors.map((q, i) => {
                    return <option key={q.name + i} value={q.name}> {q.name} </option>
                  })}
                </select>
              </div>
              <div className='me-3'>
                {year && <select className='form-select' defaultValue="" name="year" id="year"> Select Year
                  {year.years.map((q, i) => {
                    return <option key={q} value={q} > {q} </option>
                  })}
                </select>}
              </div>
              <div>
                <button type='submit' className='btn btn-primary'>Search</button>
              </div>
            </form>
          </div>}
          <MenteesListSearch stu={filteredStudents} />
        </div>

      </div>
    </div>
  )
}

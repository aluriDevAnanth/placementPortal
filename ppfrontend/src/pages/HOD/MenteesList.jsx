import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import HODCon from '../../context/HODPro'
import MenteesListSearch from './components/MenteesListSearch'
import { AutoComplete } from 'primereact/autocomplete';

export default function MenteesList() {
  const { year, stu, mentors } = useContext(HODCon)
  const [filteredStudents, setFilteredStudents] = useState()
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [filteredMentors, setFilteredMentors] = useState([]);

  useEffect(() => {
    setFilteredStudents(stu)
  }, [stu]);

  const handleSelectMentor = (e) => {
    setSelectedMentor(e.value);
  };

  const searchMentors = (event) => {
    const filteredMentors = mentors.filter((mentor) =>
      mentor.name.toLowerCase().includes(event.query.toLowerCase())
    );
    setFilteredMentors(filteredMentors);
  };

  const filterStu = (e) => {
    e.preventDefault();
    const selectedYear = document.getElementById('year').value;
    const q = stu.filter(student => {
      return student.mentor === selectedMentor.name && student.batch === selectedYear;
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
          {mentors && <div className='flex-fill mb-3'>
            <form onSubmit={filterStu} className='d-flex'>
              <p className='fw-bolder fs-4 me-3' >Search</p>
              <AutoComplete className='flex-fill me-3' value={selectedMentor} suggestions={filteredMentors} completeMethod={searchMentors} field="name"
                dropdown onChange={handleSelectMentor} placeholder="Select a Mentor" emptyMessage="Mentor Not Found" virtualScrollerOptions={{ itemSize: 38, scrollHeight: "400px", scrollWidth: "400px" }} />
              <div className='flex-fill me-3'>
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

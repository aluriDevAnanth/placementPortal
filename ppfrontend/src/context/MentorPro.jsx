import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthCon from './AuthPro';

const MentorCon = createContext({});

export function MentorPro({ children }) {
  const years = ["2018", "2019"]
  const [year, setYear] = useState();
  const [students, setStudents] = useState()
  const { auth } = useContext(AuthCon)

  async function fetchYears() {
    const response = await fetch(`http://localhost:3000/api/mentor/getYears`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    if (res) {
      let q = { curr: years.at(-1), years: years.slice().reverse() }
      setYear(q)
      //console.log(q)
    }
  }

  async function fetchStudents() {
    const response1 = await fetch(`http://localhost:3000/api/mentor/getStudents/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res1 = await response1.json();
    setStudents(res1.data.studentList)
    //console.log(students)
  }

  useEffect(() => {
    if (auth) {
      fetchYears();
    }
  }, [auth])


  useEffect(() => {
    if (auth && year) {
      fetchStudents();
      //console.log(year.curr);
    }
  }, [year, auth])

  return (
    <MentorCon.Provider value={{ students, setStudents, setYear, year }}>{children}</MentorCon.Provider>
  );
}

export default MentorCon;

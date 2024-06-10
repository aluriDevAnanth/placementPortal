import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthCon from './AuthPro';

const MentorCon = createContext({});

export function MentorPro({ children }) {
  const [year, setYear] = useState({});
  const [students, setStudents] = useState()
  const { auth } = useContext(AuthCon)
  const baseURL = process.env.BASE_URL

  const fetchYears = async () => {
    try {
      const response = await fetch(`${baseURL}/admin/getYears`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      if (res.data && res.data.years) {
        const sortedYears = res.data.years.sort((a, b) => b - a);
        setYear({ curr: sortedYears[0], years: sortedYears });
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  async function fetchStudents() {
    const response1 = await fetch(`${baseURL}/mentor/getStudents/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response1.json();
    setStudents(res.data?.studentList)
  }

  useEffect(() => {
    if (auth) {
      fetchYears();
    }
  }, [auth])


  useEffect(() => {
    if (auth && year) {
      fetchStudents();
    }
  }, [year, auth])

  return (
    <MentorCon.Provider value={{ students, setYear, year }}>{children}</MentorCon.Provider>
  );
}

export default MentorCon;

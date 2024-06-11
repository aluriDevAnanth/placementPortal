import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthCon from './AuthPro';

const StudentCon = createContext({});

export function StudentPro({ children }) {
  const { auth } = useContext(AuthCon)
  const [year, setYear] = useState({});
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
  useEffect(() => {
    if (auth) {
      fetchYears();
    }
  }, [auth])
  return (
    <StudentCon.Provider value={{ year }}>{children}</StudentCon.Provider>
  );
}

export default StudentCon;

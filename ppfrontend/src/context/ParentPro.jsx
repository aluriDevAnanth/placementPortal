import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthCon from './AuthPro';

const ParentCon = createContext({});

export function ParentPro({ children }) {
  const { auth } = useContext(AuthCon)
  const [year, setYear] = useState({});
  const [user, setUser] = useState(null);
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

  async function fetchUser() {
    try {
      const response = await fetch(`${baseURL}/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      //console.log(res);
      if (res.data.role === 'dean' && localStorage.getItem('role')) {
        let q = { ...res.data.user, role: localStorage.getItem('role') }
        setUser(q)
      } else {
        let q = { ...res.data.user, role: res.data.role }
        setUser(q)
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  useEffect(() => {
    if (auth !== undefined) {
      fetchUser();
    }
  }, [auth]);

  return (
    <ParentCon.Provider value={{ year }}>{children}</ParentCon.Provider>
  );
}

export default ParentCon;

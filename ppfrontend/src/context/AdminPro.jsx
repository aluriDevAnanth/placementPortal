import React, { createContext, useEffect, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import AuthCon from './AuthPro';

const AdminCon = createContext({});

export function AdminPro({ children }) {
  const [year, setYear] = useState({});
  const [mentors, setMentors] = useState([])
  const [comp, setComp] = useState([])
  const [stu, setStu] = useState([])
  const [feed, setFeed] = useState()
  const { auth } = useContext(AuthCon)

  async function fetchMentors() {
    const response = await fetch(`http://localhost:3000/api/dean/getAllMentors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setMentors(res.data.mentorList)
  }

  async function fetchFeed() {
    const response = await fetch(`http://localhost:3000/api/dean/getAllFeed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setFeed(res.data.feedList)
  }

  async function fetchStudents() {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/getStu/${year.curr}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
      });

      const res = await response.json();
      //console.log(res.data);
      let s = {}
      res.data.stu.map(q => {
        s[q.rollno] = q
      })
      setStu(s);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchComp() {
    const response = await fetch(`http://localhost:3000/api/mentor/getCom/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setComp(res.data)
    //console.log('res.data', res.data);
  }

  const fetchYears = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/getYears`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      if (res.data && res.data.years) {
        const sortedYears = res.data.years.sort((a, b) => b - a);
        //console.log(sortedYears);
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
  }, [auth]);

  useEffect(() => {
    if (auth && year.curr) { fetchStudents(); fetchMentors(); fetchComp(); fetchFeed(); }
  }, [auth, year.curr])

  return (
    <AdminCon.Provider value={{ year, setYear, mentors, stu, comp, feed, setStu }}>{children}</AdminCon.Provider>
  );
}

export default AdminCon;

import React, { createContext, useEffect, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import AuthCon from './AuthPro';

const AdminCon = createContext({});

export function AdminPro({ children }) {
  const years = ["2018", "2019"]
  const [year, setYear] = useState({ curr: years.at(-1), years });
  const [mentors, setMentors] = useState([])
  const [comp, setComp] = useState([])
  const [stu, setStu] = useState()
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
    const response = await fetch(`http://localhost:3000/api/dean/getAllStudents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setStu(res.data.studentList)
  }

  async function fetchComp() {
    const response = await fetch(`http://localhost:3000/api/dean/getAllComp`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setComp(res.data.compList)
    //console.log(comp)
  }

  useEffect(() => {
    if (auth !== undefined) {
      fetchMentors(); fetchStudents(); fetchComp(); fetchFeed(); ``
    }
  }, [])

  return (
    <AdminCon.Provider value={{ year, mentors, stu, comp, feed }}>{children}</AdminCon.Provider>
  );
}

export default AdminCon;

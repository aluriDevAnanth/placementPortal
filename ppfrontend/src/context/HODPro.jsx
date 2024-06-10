import React, { createContext, useEffect, useState, useContext } from 'react';
import AuthCon from './AuthPro';

const HODCon = createContext({});

export function HODPro({ children }) {
  const years = ["2018", "2019"]
  const [year, setYear] = useState({ curr: years.at(-1), years });
  const [mentors, setMentors] = useState([])
  const [comp, setComp] = useState([])
  const [stu, setStu] = useState()
  const [feed, setFeed] = useState()
  const { auth } = useContext(AuthCon)
  const baseURL = process.env.BASE_URL

  async function fetchMentors() {
    const response = await fetch(`${baseURL}/hod/getAllMentors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    //console.log(res.data)
    setMentors(res.data.mentorList)
  }

  async function fetchFeed() {
    const response = await fetch(`${baseURL}/hod/getAllFeed`, {
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
    const response = await fetch(`${baseURL}/dean/getAllStudents/${year.curr}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    setStu(res.data.studentList)
    //console.log(stu)
  }

  async function fetchComp() {
    const response = await fetch(`${baseURL}/dean/getAllComp`, {
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

  async function fetchYears() {
    const response = await fetch(`${baseURL}/mentor/getYears`, {
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

  useEffect(() => {
    if (auth) {
      fetchYears();
    }
  }, [auth])

  useEffect(() => {
    if (auth) {
      fetchMentors(); fetchStudents(); fetchComp(); fetchFeed();
    }
  }, [auth, year])

  return (
    <HODCon.Provider value={{ year, mentors, stu, comp, feed, year, setYear }}>{children}</HODCon.Provider>
  );
}

export default HODCon;

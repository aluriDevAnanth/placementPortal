import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/ParentSidebar'
import AuthCon from '../../context/AuthPro';
import MentorCon from "../../context/MentorPro";

export default function ParentTestSchedule() {
  const { user, auth } = useContext(AuthCon);
  const [schedule, setSchedule] = useState()
  const mystyle = {
    backgroundColor: "#696747",
    color: "white",
  };
  const baseURL = process.env.BASE_URL

  async function fetchSchedule() {
    const response = await fetch(`${baseURL}/mentor/getSchedule/${user.batch}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    //console.log(res)
    setSchedule(res.data)
  }

  useEffect(() => {
    fetchSchedule()
  }, [])


  return (
    user !== null && (
      <div className="bodyBG">
        <div className="container-fluid">
          <div className="d-flex">
            <div className="">
              <Sidebar />
            </div>
            {schedule ? (
              <div className="flex-fill ms-3 border-primary me-3">
                <table className="shadow table table-striped table-bordered  table-hover">
                  <tbody>
                    <tr className="text-center" style={mystyle}>
                      <th>Date</th>
                      <th>Tests </th>
                    </tr>
                    {
                      schedule.map((q, i) => {
                        return <tr key={i} className="text-center"><td>{q.date}</td><td>{q.testno}</td></tr>
                      })
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    )
  );
}

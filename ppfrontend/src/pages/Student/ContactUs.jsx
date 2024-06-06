import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import ListGroup from 'react-bootstrap/ListGroup';
import AuthCon from '../../context/AuthPro'

export default function ContactUs() {
  const [men, setMen] = useState()
  const { auth } = useContext(AuthCon)

  async function fetchMentorDetails() {
    const response = await fetch(`http://localhost:3000/api/parent/getMentorDetails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    const { _id, __v, role, sno, dept, ...cleanedData } = res.data.men;
    console.log(cleanedData);
    setMen(cleanedData)
  }

  useEffect(() => {
    fetchMentorDetails();
  }, [])
  return (
    <div className=' container-fluid d-flex'>
      <div >
        <Sidebar />
      </div>
      <div>
        <div className='ms-3 bg-white p-3 rounded-4'>
          <p className='fs-3 fw-bold m-0'>Corporate Relations & Career Services:</p>
          <ListGroup>
            <ListGroup.Item>   Call 08632343020  </ListGroup.Item>
            <ListGroup.Item> Email to crcs.helpdesk@srmap.edu.in   </ListGroup.Item>
          </ListGroup>
          <p className='fs-3 fw-bold mb-1 mt-3'>Mentor Details:</p>
          <ListGroup className=''>
            {men && Object.entries(men).map(([key, value], i) => {
              return (
                <ListGroup.Item key={i}>
                  {key}: {value}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
    </div>
  )
}

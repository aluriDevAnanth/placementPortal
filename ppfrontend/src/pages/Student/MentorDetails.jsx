import React, { useContext, useEffect, useState } from 'react'
import ParentSidebar from './components/ParentSidebar'
import ListGroup from 'react-bootstrap/ListGroup';
import AuthCon from '../../context/AuthPro';

export default function MentorDetails() {
  const [men, setMen] = useState()
  const { auth } = useContext(AuthCon)
  const baseURL = process.env.BASE_URL

  async function fetchMentorDetails() {
    const response = await fetch(`${baseURL}/parent/getMentorDetails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
      },
    });
    const res = await response.json();
    const { _id, __v, role, ...cleanedData } = res.data.men;
    console.log(cleanedData);
    setMen(cleanedData)
  }

  useEffect(() => {
    fetchMentorDetails();
  }, [])


  return (
    <div className='container-fluid d-flex gap-3'>
      <div>
        <ParentSidebar />
      </div>
      <div className='flex-fill border-4 border-dark container-fluid'>
        <ListGroup>
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
  )
}

import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import AuthCon from '../../context/AuthPro';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

export default function MyPractise() {
  const { auth } = useContext(AuthCon);
  const [prac, setPrac] = useState({});
  const [load, setLoad] = useState(true);
  const baseURL = process.env.BASE_URL

  async function fetchPracDet() {
    try {
      const response = await fetch(`${baseURL}/student/getPracDet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
      });
      const res = await response.json();
      //console.log(11, res);
      setPrac({ ...res.data });
      setLoad(false)
    } catch (error) {
      console.error('Error fetching practice details:', error);
    }
  }

  useEffect(() => {
    if (auth) {
      fetchPracDet();
    }
  }, [auth]);

  return (
    <div className='container-fluid d-flex'>
      <div>
        <Sidebar />
      </div>
      {/* {load ? <div className='w-100 d-flex justify-content-center align-items-center'> <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner></div> : <div className='row w-100'>
        {Object.keys(prac).map((platform, i) => (
          <div key={i} className='ms-3 col-4'>
            <ListGroup >
              <ListGroup.Item active>{platform}</ListGroup.Item>
              {Object.entries(prac[platform]).map(([key, value], j) => (
                <ListGroup.Item key={j}>{key}: {String(value)}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))}
      </div>} */}
    </div>
  );
}

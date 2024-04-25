import React from 'react'
import Sidebar from './components/Sidebar'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function RevMat() {
  return (
    <div className=' container-fluid d-flex'>
      <div >
        <Sidebar />
      </div>
      <div className='ms-3 container-fluid mb-5'>
        <div className="row gap-5">
          <div className='col'>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src="https://placehold.co/400?text=CSE" />
              <Card.Body>
                <Card.Title>CSE</Card.Title>
                <Button variant="primary">Go to CSE</Button>
              </Card.Body>
            </Card>
          </div>
          <div className='col'>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src="https://placehold.co/400?text=ECE" />
              <Card.Body>
                <Card.Title>ECE</Card.Title>
                <Button variant="primary">Go to ECE</Button>
              </Card.Body>
            </Card>
          </div>
          <div className='col'>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src="https://placehold.co/400?text=EEE" />
              <Card.Body>
                <Card.Title>EEE</Card.Title>
                <Button variant="primary">Go to ECE</Button>
              </Card.Body>
            </Card>
          </div>
          <div className='col'>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src="https://placehold.co/400?text=CIVIL" />
              <Card.Body>
                <Card.Title>CIVIL</Card.Title>
                <Button variant="primary">Go to ECE</Button>
              </Card.Body>
            </Card>
          </div>
          <div className='col'>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src="https://placehold.co/400?text=MECH" />
              <Card.Body>
                <Card.Title>MECH</Card.Title>
                <Button variant="primary">Go to ECE</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

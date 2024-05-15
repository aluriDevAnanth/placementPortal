import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Table from 'react-bootstrap/Table';
import AuthCon from '../../context/AuthPro';

export default function CoorHome() {
  const { auth, user } = useContext(AuthCon);

  return (
    <div className='container-fluid d-flex'>
      <div>
        <Sidebar />
      </div>
      <div className='flex-fill container-fluid'>
        <p>Home</p>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthCon from './AuthPro';

const StudentCon = createContext({});

export function StudentPro({ children }) {
  const { auth } = useContext(AuthCon)

  return (
    <StudentCon.Provider value={{}}>{children}</StudentCon.Provider>
  );
}

export default StudentCon;

import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthCon from './AuthPro';

const ParentCon = createContext({});

export function ParentPro({ children }) {
  const { auth } = useContext(AuthCon)

  return (
    <ParentCon.Provider value={{}}>{children}</ParentCon.Provider>
  );
}

export default ParentCon;

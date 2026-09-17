import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('civicfix_demo_role') || 'citizen';
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('civicfix_demo_user') || 'Alex (Citizen)';
  });

  const selectRole = (role, name) => {
    setUserRole(role);
    const displayName = name || (role === 'admin' ? 'Officer Sharma (Authority)' : 'Alex (Citizen)');
    setUserName(displayName);
    localStorage.setItem('civicfix_demo_role', role);
    localStorage.setItem('civicfix_demo_user', displayName);
  };

  return (
    <AuthContext.Provider value={{ userRole, userName, selectRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

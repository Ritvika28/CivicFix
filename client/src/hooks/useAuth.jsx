import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('civicfix_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    // Backward compatibility for demo role
    const legacyRole = localStorage.getItem('civicfix_demo_role');
    const legacyName = localStorage.getItem('civicfix_demo_user');
    if (legacyRole) {
      return {
        name: legacyName || (legacyRole === 'admin' ? 'Officer Sharma (Authority)' : 'Alex (Citizen)'),
        email: legacyRole === 'admin' ? 'officer.sharma@civicfix.gov' : 'alex@civicfix.org',
        role: legacyRole
      };
    }
    return null;
  });

  const isAuthenticated = !!user;
  const userRole = user?.role || null;
  const userName = user?.name || '';

  const loginCitizen = (email, password) => {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }
    const citizenUser = {
      name: email.split('@')[0] ? email.split('@')[0].replace('.', ' ') : 'Alex (Citizen)',
      email,
      role: 'citizen'
    };
    setUser(citizenUser);
    localStorage.setItem('civicfix_user', JSON.stringify(citizenUser));
    localStorage.setItem('civicfix_demo_role', 'citizen');
    localStorage.setItem('civicfix_demo_user', citizenUser.name);
    return citizenUser;
  };

  const signupCitizen = (name, email, password) => {
    if (!name || !email || !password) {
      throw new Error('Please fill out all required fields.');
    }
    const newCitizen = {
      name,
      email,
      role: 'citizen'
    };
    setUser(newCitizen);
    localStorage.setItem('civicfix_user', JSON.stringify(newCitizen));
    localStorage.setItem('civicfix_demo_role', 'citizen');
    localStorage.setItem('civicfix_demo_user', newCitizen.name);
    return newCitizen;
  };

  const loginAuthority = (email, password) => {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }
    const authorityUser = {
      name: 'Officer Sharma (Authority)',
      email,
      role: 'admin'
    };
    setUser(authorityUser);
    localStorage.setItem('civicfix_user', JSON.stringify(authorityUser));
    localStorage.setItem('civicfix_demo_role', 'admin');
    localStorage.setItem('civicfix_demo_user', authorityUser.name);
    return authorityUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civicfix_user');
    localStorage.removeItem('civicfix_demo_role');
    localStorage.removeItem('civicfix_demo_user');
  };

  // Kept for seamless legacy role toggles
  const selectRole = (role, name) => {
    const updatedUser = {
      name: name || (role === 'admin' ? 'Officer Sharma (Authority)' : 'Alex (Citizen)'),
      email: role === 'admin' ? 'officer.sharma@civicfix.gov' : 'alex@civicfix.org',
      role
    };
    setUser(updatedUser);
    localStorage.setItem('civicfix_user', JSON.stringify(updatedUser));
    localStorage.setItem('civicfix_demo_role', role);
    localStorage.setItem('civicfix_demo_user', updatedUser.name);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      userName,
      isAuthenticated,
      loginCitizen,
      signupCitizen,
      loginAuthority,
      logout,
      selectRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

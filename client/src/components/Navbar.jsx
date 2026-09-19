import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, userName, isAuthenticated, logout, selectRole } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleRoleChange = (newRole) => {
    if (isAuthenticated && userRole === newRole) {
      if (newRole === 'admin') navigate('/admin');
      else navigate('/citizen');
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?role=${newRole}`);
      return;
    }

    // Switch role if authenticated
    const name = newRole === 'admin' ? 'Officer Sharma (Authority)' : 'Alex (Citizen)';
    selectRole(newRole, name);
    if (newRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeLinkClasses = "px-4 py-2 bg-civic-50 text-civic-700 font-bold border-b-2 border-civic-500";
  const inactiveLinkClasses = "px-4 py-2 text-slate-600 font-medium hover:text-civic-700 hover:bg-slate-50 rounded-lg transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[#E6E8E3]" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div className="max-w-[1380px] mx-auto px-4 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 min-w-0">
          {/* Brand Logo */}
          <Link to={userRole === 'admin' ? '/admin' : '/'} className="flex items-center gap-2 group shrink-0 min-w-0">
            <Leaf className={`w-8 h-8 ${userRole === 'admin' ? 'text-slate-700' : 'text-civic-700'} group-hover:scale-105 transition-transform`} />
            <div>
              <span className="text-[22px] font-bold tracking-tight text-civic-dark flex items-center gap-1">
                Civic<span className={userRole === 'admin' ? 'text-slate-600' : 'text-civic-600'}>Fix</span>
              </span>
              <span className="text-[10px] text-slate-500 block -mt-1 tracking-wide">
                Cleaner Cities. Stronger Communities.
              </span>
            </div>
          </Link>

          {/* Navigation Links — Role Specific */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center min-w-0">
            {userRole === 'admin' ? (
              <>
                <Link to="/admin" className={isActive('/admin') ? activeLinkClasses : inactiveLinkClasses}>
                  Command Center
                </Link>
                <a href="/admin#work-orders" className={inactiveLinkClasses}>
                  Incident Work Orders
                </a>
                <a href="/admin#map" className={inactiveLinkClasses}>
                  GIS / Hotspots
                </a>
              </>
            ) : (
              <>
                <Link to="/" className={isActive('/') ? activeLinkClasses : inactiveLinkClasses}>
                  Home
                </Link>
                <Link to="/report" className={isActive('/report') ? activeLinkClasses : inactiveLinkClasses}>
                  Report Issue
                </Link>
                <Link to="/citizen" className={isActive('/citizen') ? activeLinkClasses : inactiveLinkClasses}>
                  My Reports
                </Link>
              </>
            )}
          </nav>

          {/* Role Switcher Pill & Auth Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-white border border-[#E6E8E3] p-1 rounded-lg text-sm shadow-sm">
              <span className="text-[11px] text-slate-400 px-3 font-semibold uppercase tracking-widest hidden sm:inline">Role:</span>
              <button
                onClick={() => handleRoleChange('citizen')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  userRole === 'citizen'
                    ? 'bg-civic-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  userRole === 'admin'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Authority
              </button>
            </div>

            {/* Logout / Login Button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                title={`Signed in as ${userName}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-[#E6E8E3] text-sm font-semibold transition-colors shadow-sm"
              >
                <span className="hidden sm:inline text-slate-500 max-w-[120px] truncate">
                  {userName}
                </span>
                <span className="text-civic-dark font-bold pl-2 border-l border-slate-200">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-civic-600 hover:bg-civic-700 text-white text-sm font-bold transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, LogIn, User, Building2 } from 'lucide-react';
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

  const activeLinkClasses = "px-4 py-2 bg-[#EEF6EE] text-[#1F5E35] font-bold border-b-2 border-[#43A85F] rounded-t-lg shadow-sm transition-all";
  const inactiveLinkClasses = "px-4 py-2 text-[#52635A] font-medium hover:text-[#1F5E35] hover:bg-[#F6FAF5] rounded-lg transition-all duration-150";

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#D6E4D7] shadow-sm" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div className="max-w-[1380px] mx-auto px-4 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 min-w-0">
          {/* Brand Logo */}
          <Link to={userRole === 'admin' ? '/admin' : '/'} className="flex items-center gap-2.5 group shrink-0 min-w-0">
            <div className="p-1.5 rounded-lg bg-[#EEF6EE] border border-[#D6E4D7] group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-[#2F7D46]" />
            </div>
            <div>
              <span className="text-[22px] font-bold tracking-tight text-[#174A2A] flex items-center gap-1">
                Civic<span className="text-[#2F7D46]">Fix</span>
              </span>
              <span className="text-[10px] text-[#52635A] block -mt-1 tracking-wide font-medium">
                Cleaner Cities. Stronger Communities.
              </span>
            </div>
          </Link>

          {/* Navigation Links — Role Specific */}
          <nav className="hidden md:flex items-center gap-1.5 flex-1 justify-center min-w-0">
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
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1 bg-[#F6FAF5] border border-[#D6E4D7] p-1 rounded-lg text-sm shadow-sm">
              <span className="text-[11px] text-[#52635A] px-2.5 font-semibold uppercase tracking-widest hidden sm:inline">Role:</span>
              <button
                onClick={() => handleRoleChange('citizen')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                  userRole === 'citizen'
                    ? 'bg-[#EEF6EE] text-[#1F5E35] border border-[#43A85F] shadow-sm'
                    : 'text-[#52635A] hover:text-[#17312A]'
                }`}
              >
                <User size={15} />
                Citizen
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                  userRole === 'admin'
                    ? 'bg-[#174A2A] text-white border border-[#174A2A] shadow-sm'
                    : 'text-[#52635A] hover:text-[#17312A]'
                }`}
              >
                <Building2 size={15} />
                Authority
              </button>
            </div>

            {/* Logout / Login Button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                title={`Signed in as ${userName}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFFFFF] hover:bg-[#F6FAF5] text-[#17312A] border border-[#D6E4D7] text-sm font-semibold transition-all shadow-sm"
              >
                <span className="hidden sm:inline text-[#52635A] max-w-[120px] truncate">
                  {userName}
                </span>
                <span className="text-[#1F5E35] font-bold pl-2 border-l border-[#D6E4D7]">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#2F7D46] hover:bg-[#1F5E35] text-white text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4 text-white" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

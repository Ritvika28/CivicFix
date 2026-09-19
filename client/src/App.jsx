import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Shield } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportIssue from './pages/ReportIssue';
import IssueDetails from './pages/IssueDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminIssueDetails from './pages/AdminIssueDetails';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login?role=citizen" replace />;
  }
  return children;
}

function AuthorityRoute({ children }) {
  const { isAuthenticated, userRole, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login?role=admin" replace />;
  }

  if (userRole !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass-card rounded-2xl text-center space-y-4 border border-indigo-500/30">
        <Shield className="w-12 h-12 text-indigo-600 mx-auto" />
        <h2 className="text-xl font-bold text-civic-dark">Authority Access Required</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          You are currently signed in as a Citizen. The Authority Command Center is restricted to municipal response officers.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/login?role=admin"
            onClick={() => logout()}
            className="py-2.5 px-4 rounded-xl bg-civic-200 hover:bg-civic-300 text-civic-950 font-extrabold text-xs border border-civic-400 shadow-sm transition-colors"
          >
            Sign In as Authority
          </Link>
          <Link to="/citizen" className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-civic-dark text-xs border border-slate-300 font-bold shadow-sm">
            My Citizen Dashboard
          </Link>
        </div>
      </div>
    );
  }
  return children;
}

function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F7F6F1] text-civic-dark" style={{ overflowX: 'hidden', width: '100%' }}>
      <Navbar />
      <main className="flex-1 w-full flex flex-col" style={{ boxSizing: 'border-box' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/citizen" element={<ProtectedRoute><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
          <Route path="/issues/:id" element={<IssueDetails />} />
          <Route path="/admin" element={<AuthorityRoute><AdminDashboard /></AuthorityRoute>} />
          <Route path="/admin/issues/:id" element={<AuthorityRoute><AdminIssueDetails /></AuthorityRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}

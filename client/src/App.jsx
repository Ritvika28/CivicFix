import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
        <Shield className="w-12 h-12 text-indigo-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Authority Access Required</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          You are currently signed in as a Citizen. The Authority Command Center is restricted to municipal response officers.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/login?role=admin"
            onClick={() => logout()}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-colors"
          >
            Sign In as Authority
          </Link>
          <Link to="/citizen" className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 font-medium">
            My Citizen Dashboard
          </Link>
        </div>
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
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
      </Router>
    </AuthProvider>
  );
}

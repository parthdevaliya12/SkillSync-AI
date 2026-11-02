import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <div className="absolute font-mono text-xs font-semibold text-indigo-400">AI</div>
        </div>
        <p className="mt-4 text-slate-400 text-sm font-medium tracking-wide animate-pulse">
          Authenticating SkillSync AI...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

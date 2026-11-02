import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Guards
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import MySkills from './pages/MySkills';
import JobAnalyzer from './pages/JobAnalyzer';
import JobDetails from './pages/JobDetails';
import SkillGap from './pages/SkillGap';
import Roadmaps from './pages/Roadmaps';
import RoadmapDetails from './pages/RoadmapDetails';
import AIAssistant from './pages/AIAssistant';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0b0f19',
            color: '#fff',
            borderRadius: '18px',
            fontSize: '13px',
            padding: '12px 18px',
            boxShadow: '0 20px 40px -15px rgba(11, 15, 25, 0.4)',
            border: '1px solid #1e2638',
            fontFamily: 'Outfit, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#14b8a6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skills" element={<MySkills />} />
          <Route path="/job-analyzer" element={<JobAnalyzer />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/skill-gap/:jobId" element={<SkillGap />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/roadmaps/:id" element={<RoadmapDetails />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;

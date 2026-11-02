import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const pageTitles = {
  '/dashboard': 'Executive Analytics Dashboard',
  '/skills': 'Technical Skill Portfolio',
  '/job-analyzer': 'AI Job Description Analyzer',
  '/skill-gap': 'Skill Gap Intelligence & Readiness',
  '/roadmaps': 'Personalized AI Learning Roadmaps',
  '/assistant': 'AI Career Guidance Assistant',
  '/profile': 'Profile & Account Settings',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Match title or subpath
  let currentTitle = pageTitles[location.pathname];
  if (!currentTitle) {
    if (location.pathname.startsWith('/roadmaps/')) currentTitle = 'Roadmap Curriculum Details';
    else if (location.pathname.startsWith('/jobs/')) currentTitle = 'Job Analysis Breakdown';
    else if (location.pathname.startsWith('/skill-gap/')) currentTitle = 'Skill Gap Report';
    else currentTitle = 'SkillSync AI Workspace';
  }

  return (
    <div className="min-h-screen bg-[#fbfbfe] font-sans flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          title={currentTitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

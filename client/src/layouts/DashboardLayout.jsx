import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const pageTitleMap = {
  '/dashboard': { full: 'Executive Analytics Dashboard', short: 'Dashboard' },
  '/skills': { full: 'Technical Skill Portfolio', short: 'My Skills' },
  '/job-analyzer': { full: 'AI Job Description Analyzer', short: 'Job Analyzer' },
  '/skill-gap': { full: 'Skill Gap Intelligence & Readiness', short: 'Skill Gap' },
  '/roadmaps': { full: 'Personalized AI Learning Roadmaps', short: 'Roadmaps' },
  '/assistant': { full: 'AI Career Guidance Assistant', short: 'Career AI' },
  '/profile': { full: 'Profile & Account Settings', short: 'Profile' },
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Match title or subpath
  let current = pageTitleMap[location.pathname];
  if (!current) {
    if (location.pathname.startsWith('/roadmaps/')) current = { full: 'Roadmap Curriculum Details', short: 'Curriculum' };
    else if (location.pathname.startsWith('/jobs/')) current = { full: 'Job Analysis Breakdown', short: 'Job Details' };
    else if (location.pathname.startsWith('/skill-gap/')) current = { full: 'Skill Gap Report', short: 'Skill Gap' };
    else current = { full: 'SkillSync AI Workspace', short: 'Workspace' };
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          title={current.full}
          shortTitle={current.short}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

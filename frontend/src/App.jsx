import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import Contact from './pages/Contact';
import OverviewPage from './pages/OverviewPage';
import DirectionFinanciereDashboard from './pages/DirectionFinanciereDashboard'; 
import AgentSaisieDashboard from './pages/AgentSaisieDashboard'; 
import AvancesConsultation from './pages/AvancesConsultation'; 
import Devise from './pages/Devise';
// Import Sidebars
import Sidebar from './components/Sidebar';
import SidebarAgentSaisie from './components/Sidebaragentsaisie'; 

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  
  // Determine which sidebar to show
  let sidebarComponent = null;
  if (location.pathname !== '/') {
    sidebarComponent = location.pathname === '/agent-saisie-dashboard' ? <SidebarAgentSaisie /> : <Sidebar />;
  }

  const layoutStyle = {
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',  // White background
    color: '#b91c1c',  // Red text color
    overflow: 'hidden',
  };

  const sidebarStyle = {
    width: '16rem',  
    position: 'fixed',
    left: '0',
    backgroundColor: '#b91c1c',  // Red background for sidebar
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // shadow-lg
  };

  const contentStyle = {
    flexGrow: 1,
    overflow: 'auto',
    padding: '1.5rem',  // p-6
    transition: 'all 0.3s',  // transition-all duration-300
    paddingLeft: sidebarComponent ? '16rem' : '0',  // Adjust padding for sidebar
    backgroundColor: '#ffffff',  // White background for content
    color: '#b91c1c',  // Red text color
  };

  return (
    <div style={layoutStyle}>
      {sidebarComponent && <div style={sidebarStyle}>{sidebarComponent}</div>}

      <div style={contentStyle}>
        <Routes>
          {/* Login Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Authenticated Routes */}
          <Route path="/overviewPage" element={<OverviewPage />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-contact" element={<Contact />} />
          <Route path="/direction-financiere-dashboard" element={<DirectionFinanciereDashboard />} />
          <Route path="/agent-saisie-dashboard" element={<AgentSaisieDashboard />} />
          <Route path="/avances-consultation" element={<AvancesConsultation />} />
          <Route path="/devise" element={<Devise />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

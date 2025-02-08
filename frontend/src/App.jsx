import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './pages/Sidebar';
import LoginPage from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import Contact from './pages/Contact';
import Calendar from './pages/Calender';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app">
        {/* <Sidebar /> */}

        <main className="content">
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-contact" element={<Contact />} />
            <Route path="/admin-calendar" element={<Calendar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

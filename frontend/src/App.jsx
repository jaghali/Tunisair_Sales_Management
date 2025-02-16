import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Importer les pages nécessaires
import LoginPage from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import Contact from './pages/Contact';
import Calendar from './pages/Calender';
import Dashboard from './pages/Dashboard';
import DirectionFinanciereDashboard from './pages/DirectionFinanciereDashboard'; 
import AgentSaisieDashboard from './pages/AgentSaisieDashboard'; 
import AvancesConsultation from './pages/AvancesConsultation'; 

function App() {
  return (
    <Router>
      <div className="app">
        <main className="content">
          <Routes>
            {/* Route pour la page de connexion */}
            <Route path="/" element={<LoginPage />} />

            {/* Routes accessibles après authentification en fonction du rôle */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-contact" element={<Contact />} />
            <Route path="/admin-calendar" element={<Calendar />} />
            <Route path="/direction-financiere-dashboard" element={<DirectionFinanciereDashboard />} />
            <Route path="/agent-saisie-dashboard" element={<AgentSaisieDashboard />} />
            
            {/* Route pour la page de consultation des avances pour PNC et PNT */}
            <Route path="/avances-consultation" element={<AvancesConsultation />} />
            
            {/* Ajouter d'autres routes en fonction des besoins */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

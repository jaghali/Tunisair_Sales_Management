import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/Login";
import AdminUsers from "./pages/AdminUsers";
import Contact from "./pages/Contact";
import OverviewPage from "./pages/OverviewPage";
import DirectionFinanciereDashboard from "./pages/DirectionFinanciereDashboard";
import AvancesConsultation from "./pages/AvancesConsultation";
import EnteteVente from "./pages/EnteteVente";
import EnteteVenteArr from "./pages/EnteteVenteArr";
import EnteteOffres from "./pages/EnteteOffre";
import EnteteOffresArr from "./pages/EnteteOffreArr";
import Devise from "./pages/Devise";
import Sidebar from "./components/Sidebar";
import SidebarAgentSaisie from "./components/Sidebaragentsaisie";
import VentePage from "./pages/VentePage";
import VentePageArr from "./pages/VentePageArr";
import OffrePage from "./pages/OffrePage";
import OffrePageArr from "./pages/OffrePageArr";
import ArticlesPage from "./pages/ArticlesPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import FournisseurPage from "./pages/FournisseurPage";
import Confrontation from "./pages/ConfrontationPage";
import ConfrotationOffrePage from "./pages/ConfrotationOffrePage";
import Avion from "./pages/Avion";

import "./App.css"

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const agentSaisiePages = [
    "/agent-saisie-dashboard",
    "/enteteOffre",
    "/enteteOffrearr",
    "/enteteVente",
    "/enteteVentearr",
    "/ventePage/:id",
    "/ventePagearr",
    "/OffrePage",
    "/OffrePagearr",
    "/settings",
    "/ConfrontationPage/:id",
    "/ConfrotationOffrePage",
  ];

  const hideSidebarRoutes = [
    "/", 
    "/ForgotPasswordPage",
    "/ventePagearr",
    "/OffrePage",
    "/OffrePagearr",
    "/ConfrotationOffrePage"
  ];

  const hideSidebar =
    hideSidebarRoutes.includes(location.pathname) ||
    matchPath("/ventePage/:id", location.pathname) ||
    matchPath("/ConfrontationPage/:id", location.pathname);

  let sidebarComponent = null;
  if (!hideSidebar) {
    sidebarComponent = agentSaisiePages.includes(location.pathname)
      ? <SidebarAgentSaisie />
      : <Sidebar />;
  }

  return (
    <div style={styles.layout}>
      {loading ? (
        <div style={styles.loaderContainer}>
          <svg viewBox="0 -10 30 50" height="70" width="70" style={styles.loaderSVG}>
            <path
              style={styles.track}
              fill="none"
              strokeWidth="5"
              pathLength="100"
              d="M36.63 31.746 c0 -13.394 -7.326 -25.16 -18.13 -31.376 C7.696 6.66 0.37 18.352 0.37 31.746 c5.328 3.108 11.544 4.884 18.13 4.884 S31.302 34.854 36.63 31.746z"
            />
            <path
              style={styles.car}
              fill="none"
              strokeWidth="5"
              pathLength="100"
              d="M36.63 31.746 c0 -13.394 -7.326 -25.16 -18.13 -31.376 C7.696 6.66 0.37 18.352 0.37 31.746 c5.328 3.108 11.544 4.884 18.13 4.884 S31.302 34.854 36.63 31.746z"
            />
          </svg>
          <p style={styles.loaderText}>Chargement en cours...</p>
        </div>
      ) : (
        <div style={styles.mainContent}>
          {sidebarComponent && <div style={styles.sidebar}>{sidebarComponent}</div>}
          <div style={styles.content}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/overviewPage" element={<OverviewPage />} />
              <Route path="/admin-users" element={<AdminUsers />} />
              <Route path="/admin-contact" element={<Contact />} />
              <Route path="/direction-financiere-dashboard" element={<DirectionFinanciereDashboard />} />
              <Route path="/avances-consultation" element={<AvancesConsultation />} />
              <Route path="/enteteVente" element={<EnteteVente />} />
              <Route path="/enteteVentearr" element={<EnteteVenteArr />} />
              <Route path="/enteteOffre" element={<EnteteOffres />} />
              <Route path="/enteteOffrearr" element={<EnteteOffresArr />} />
              <Route path="/ventePage/:id" element={<VentePage />} />
              <Route path="/ventePagearr" element={<VentePageArr />} />
              <Route path="/OffrePage" element={<OffrePage />} />
              <Route path="/OffrePagearr" element={<OffrePageArr />} />
              <Route path="/ArticlesPage" element={<ArticlesPage />} />
              <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
              <Route path="/Devise" element={<Devise />} />
              <Route path="/FournisseurPage" element={<FournisseurPage />} />
              <Route path="/ConfrontationPage/:id" element={<Confrontation />} />
              <Route path="/ConfrotationOffrePage" element={<ConfrotationOffrePage />} />
              <Route path="/Avion" element={<Avion />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  layout: {
    height: "100vh",
    width: "100%",
    backgroundColor: "#ffffff",
    color: "#b91c1c",
    display: "flex",
    flexDirection: "row",
  },
  mainContent: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  sidebar: {
    width: "16rem",
    position: "fixed",
    left: "0",
    top: "0",
    height: "100%",
    backgroundColor: "#b91c1c",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  content: {
    overflowY: "auto",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    color: "#b91c1c",
    transition: "all 0.3s",
  },
  loaderContainer: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  loaderText: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#3d3d3d",
  },
  track: {
    stroke: "black",
    opacity: "0.1",
  },
  car: {
    stroke: "#c80505",
    strokeDasharray: "15, 85",
    strokeDashoffset: "0",
    strokeLinecap: "round",
    animation: "travel 0.9s linear infinite",
  },
  loaderSVG: {
    animation: "rotate 1s linear infinite",
  },
};

export default App;
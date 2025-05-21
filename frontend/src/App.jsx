import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { CurrencyProvider } from "./pages/CurrencyContext";
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
import Tauxdechange from "./pages/Tauxdechange";
import Sidebar from "./components/Sidebar";
import SidebarAgentSaisie from "./components/Sidebaragentsaisie";
import SidebarFinancier from "./components/SidebarFinancier";
import UserSidebar from "./components/UserSidebar";
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
import Redevance from "./pages/Redevance";
import Commission from "./pages/Commission";
import Gemini from "./pages/Gemini";
import ProfilePage from "./pages/ProfilePage";
import TrouxCaisse from "./pages/TrouxCaisse";
import AgentSaisieDashboard from "./pages/AgentSaisieDashboard";
import Avances from "./pages/Avances";
import UserInterface from "./pages/UserInterface";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import "./i18n.js"
function App() {
  return (
    <CurrencyProvider>
    <Router>
      <MainLayout />
    </Router>
    </CurrencyProvider>
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
    "/ventePagearr/:id",
    "/OffrePage/:id",
    "/OffrePagearr/:id",
    "/settings",
    "/ConfrontationPage/:id",
    "/ConfrotationOffrePage/:id",
  ];

  const financierPages = [
    "/direction-financiere-dashboard",
    "/Redevance",
    "/Commission",
    "/TrouxCaisse",
    "/Avances",
  ];

  const userPages = [
    "/UserInterface/:matricule",
    "/ProfilePage/:matricule",
  ];

  const hideSidebarRoutes = [
    "/",
    "/ForgotPasswordPage",
    "/OffrePage/:id",
    "/OffrePagearr/:id",
    "/ConfrotationOffrePage/:id",
  ];

  const matchAnyPath = (paths) =>
    paths.some((path) => matchPath({ path, end: false }, location.pathname));

  const hideSidebar =
    hideSidebarRoutes.includes(location.pathname) ||
    matchPath({ path: "/ventePage/:id", end: false }, location.pathname) ||
    matchPath({ path: "/ventePagearr/:id", end: false }, location.pathname) ||
    matchPath({ path: "/OffrePage/:id", end: false }, location.pathname) ||
    matchPath({ path: "/OffrePagearr/:id", end: false }, location.pathname) ||
    matchPath({ path: "/ConfrontationPage/:id", end: false }, location.pathname) ||
    matchPath({ path: "/Gemini", end: true }, location.pathname);

  const sidebarComponent = useMemo(() => {
    if (hideSidebar) return null;
    if (matchAnyPath(financierPages)) return <SidebarFinancier />;
    if (matchAnyPath(agentSaisiePages)) return <SidebarAgentSaisie />;
    if (matchAnyPath(userPages)) return <UserSidebar />;
    return <Sidebar />;
  }, [location.pathname]);

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
              <Route path="/overviewPage" element={<ProtectedRoute allowedRoles={["Admin"]}><OverviewPage /></ProtectedRoute>} />
              <Route path="/admin-users" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin-contact" element={<ProtectedRoute allowedRoles={["Admin"]}><Contact /></ProtectedRoute>} />
              <Route path="/direction-financiere-dashboard" element={<ProtectedRoute allowedRoles={["DirectionFinanciere"]}><DirectionFinanciereDashboard /></ProtectedRoute>} />
              <Route path="/avances-consultation" element={<ProtectedRoute allowedRoles={["DirectionFinanciere"]}><AvancesConsultation /></ProtectedRoute>} />
              <Route path="/enteteVente" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><EnteteVente /></ProtectedRoute>} />
              <Route path="/enteteVentearr" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><EnteteVenteArr /></ProtectedRoute>} />
              <Route path="/enteteOffre" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><EnteteOffres /></ProtectedRoute>} />
              <Route path="/enteteOffrearr" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><EnteteOffresArr /></ProtectedRoute>} />
              <Route path="/ventePage/:id" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><VentePage /></ProtectedRoute>} />
              <Route path="/ventePagearr/:id" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><VentePageArr /></ProtectedRoute>} />
              <Route path="/OffrePage/:id" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><OffrePage /></ProtectedRoute>} />
              <Route path="/OffrePagearr/:id" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><OffrePageArr /></ProtectedRoute>} />
              <Route path="/ArticlesPage" element={<ProtectedRoute allowedRoles={["Admin"]}><ArticlesPage /></ProtectedRoute>} />
              <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
              <Route path="/Devise" element={<ProtectedRoute allowedRoles={["Admin"]}><Devise /></ProtectedRoute>} />
              <Route path="/Tauxdechange" element={<ProtectedRoute allowedRoles={["Admin"]}><Tauxdechange /></ProtectedRoute>} />
              <Route path="/FournisseurPage" element={<ProtectedRoute allowedRoles={["Admin"]}><FournisseurPage /></ProtectedRoute>} />
              <Route path="/ConfrontationPage/:id" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><Confrontation /></ProtectedRoute>} />
              <Route path="/ConfrotationOffrePage/:id" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><ConfrotationOffrePage /></ProtectedRoute>} />
              <Route path="/Avion" element={<ProtectedRoute allowedRoles={["Admin"]}><Avion /></ProtectedRoute>} />
              <Route path="/Redevance" element={<ProtectedRoute allowedRoles={["DirectionFinanciere"]}><Redevance /></ProtectedRoute>} />
              <Route path="/Commission" element={<ProtectedRoute allowedRoles={["DirectionFinanciere"]}><Commission /></ProtectedRoute>} />
              <Route path="/TrouxCaisse" element={<ProtectedRoute allowedRoles={["DirectionFinanciere"]}><TrouxCaisse /></ProtectedRoute>} />
              <Route path="/agent-saisie-dashboard" element={<ProtectedRoute allowedRoles={["AgentSaisie"]}><AgentSaisieDashboard /></ProtectedRoute>} />
              <Route path="/Avances" element={<ProtectedRoute allowedRoles={["DirectionFinanciere"]}><Avances /></ProtectedRoute>} />
              <Route path="/UserInterface/:matricule" element={<UserInterface />} />
              <Route path="/ProfilePage/:matricule" element={<ProfilePage />} />
              <Route path="/Gemini" element={<Gemini />} />
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

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import wavingemoji from "../components/Images/wavingemoji.png";
import { User, Mic, MicOff, ShoppingBag, Users, PackageSearch } from "lucide-react";
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";
import * as echarts from "echarts";
import AIAssistantCard from "../components/AIAssistantCard";
import { Languages } from "lucide-react";
import { Menu, MenuItem } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";

const translations = {
  fr: {
    financial: "Financier",
    dashboards: "Tableaux de bord",
    loading: "Chargement...",
    errorLoadingUser: "Impossible de charger les infos utilisateur.",
    heyNeedHelp: "Hé, besoin d'aide ?",
    inputPlaceholder: "Demandez-moi n'importe quoi !",
    trousDeCaisse: "Trous de Caisse",
    avance: "Avance",
    base: "Base",
    selectLanguage: "Choisir la langue",
    profileAria: "Profil",
    voiceAssistantAria: "Assistant vocal",
    user: "Utilisateur",
  },
  en: {
    financial: "Financial",
    dashboards: "Dashboards",
    loading: "Loading...",
    errorLoadingUser: "Unable to load user info.",
    heyNeedHelp: "Hey, need help?",
    inputPlaceholder: "Just ask me anything!",
    trousDeCaisse: "Cash Gaps",
    avance: "Advance",
    base: "Base",
    selectLanguage: "Select Language",
    profileAria: "Profile",
    voiceAssistantAria: "Voice Assistant",
    user: "User",
  },
};

const UserInterface = () => {
  const { matricule } = useParams();
  const navigate = useNavigate();

const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

const handleMenuClick = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleMenuClose = (lang) => {
  if (lang) setLanguage(lang);
  setAnchorEl(null);
};
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [conversionRate, setConversionRate] = useState(1);
  const [micEnabled, setMicEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const chartRef = useRef(null);
  const [totaleValeur, setTotaleValeur] = useState(0);
  const [totaleEncaisse, setTotaleEncaisse] = useState(0);
  const [language, setLanguage] = useState("fr");

  const t = translations[language];

  const currencyChartData = [
    { date: '2021-01', EUR: 1, USD: 1.07, GBP: 0.86, TND: 3.1 },
    { date: '2021-02', EUR: 1, USD: 1.08, GBP: 0.85, TND: 3.2 },
    { date: '2021-03', EUR: 1, USD: 1.09, GBP: 0.84, TND: 3.0 },
    { date: '2021-04', EUR: 1, USD: 1.06, GBP: 0.87, TND: 3.1 },
    { date: '2021-05', EUR: 1, USD: 1.05, GBP: 0.88, TND: 3.3 },
    { date: '2021-06', EUR: 1, USD: 1.04, GBP: 0.89, TND: 3.2 },
    { date: '2021-07', EUR: 1, USD: 1.03, GBP: 0.90, TND: 3.15 },
    { date: '2021-08', EUR: 1, USD: 1.02, GBP: 0.91, TND: 3.10 },
    { date: '2021-09', EUR: 1, USD: 1.01, GBP: 0.92, TND: 3.12 },
    { date: '2021-10', EUR: 1, USD: 1.00, GBP: 0.93, TND: 3.08 },
    { date: '2021-11', EUR: 1, USD: 0.99, GBP: 0.94, TND: 3.05 },
    { date: '2021-12', EUR: 1, USD: 1.01, GBP: 0.95, TND: 3.00 },
    { date: '2022-01', EUR: 1, USD: 1.02, GBP: 0.96, TND: 3.10 },
    { date: '2022-02', EUR: 1, USD: 1.03, GBP: 0.97, TND: 3.20 },
    { date: '2022-03', EUR: 1, USD: 1.04, GBP: 0.98, TND: 3.25 },
    { date: '2022-04', EUR: 1, USD: 1.05, GBP: 0.99, TND: 3.30 },
    { date: '2022-05', EUR: 1, USD: 1.06, GBP: 1.00, TND: 3.35 },
    { date: '2022-06', EUR: 1, USD: 1.07, GBP: 1.01, TND: 3.40 },
  ];

  
 const handleMicClick = () => {
    if (micEnabled && recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleToggleMic = () => setMicEnabled(!micEnabled);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim()) {
      try {
        const res = await fetch("http://localhost:8000/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query }),
        });
        const data = await res.json();
        setResponse(data.response || "Erreur lors de la réponse.");
      } catch (err) {
        console.error("Erreur:", err);
        setResponse("Impossible de se connecter à l'agent.");
      }
    }
  };
   useEffect(() => {
    const fetchTotaux = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/entetevente");
        const data = await res.json();
  
        const totalValeur = data.reduce((sum, item) => sum + (item.totaleValeur || 0), 0);
        const totalEncaisse = data.reduce((sum, item) => sum + (item.totaleEncaisse || 0), 0);
  
        setTotaleValeur(totalValeur);
        setTotaleEncaisse(totalEncaisse);
      } catch (err) {
        console.error("Erreur lors de la récupération des totaux:", err);
      }
    };
    fetchTotaux();
  }, []);

  useEffect(() => {
    const fetchPNInfo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/PN/${matricule}`);
        if (!res.ok) throw new Error("PN not found");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load PN info:", err);
        setError(t.errorLoadingUser);
      } finally {
        setLoading(false);
      }
    };
    fetchPNInfo();
  }, [matricule, t.errorLoadingUser]);

  useEffect(() => {
    const rates = { EUR: 1, USD: 1.07, GBP: 0.86, TND: 3.1 };
    setConversionRate(rates[selectedCurrency] || 1);
  }, [selectedCurrency]);

  useEffect(() => {
    if (chartRef.current && !loading) {
      const chartInstance = echarts.init(chartRef.current);
      const options = {
        title: { text: language === "fr" ? "Conversion de devises au fil du temps" : "Currency Conversion Over Time", left: "center" },
        tooltip: { trigger: "axis" },
        legend: { data: ["EUR", "USD", "GBP", "TND"], top: "10%" },
        xAxis: { type: "category", data: currencyChartData.map((i) => i.date) },
        yAxis: { type: "value" },
        series: ["EUR", "USD", "GBP", "TND"].map((currency) => ({
          name: currency,
          type: "line",
          data: currencyChartData.map((i) => i[currency]),
          smooth: true,
        })),
      };
      chartInstance.setOption(options);
      return () => chartInstance.dispose();
    }
  }, [currencyChartData, selectedCurrency, loading, language]);

  if (loading) return <div style={styles.container}><p>{t.loading}</p></div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.titleBlock}>
          <h1 style={styles.h1}>{t.financial}</h1>
          <p style={styles.secteur}>{t.dashboards}</p>
        </div>
        <div style={styles.nameBlock}>
  <div>
    <h1 style={styles.h1}>{user ? `${user.prenom} ${user.nom}` : t.user}</h1>
    <p style={styles.secteur}>{user?.college || ""}</p>
  </div>
  <div
    style={styles.ProfileCircle}
    onClick={() => navigate(`/ProfilePage/${matricule}`)}
  >
    <User size={30} color="#333" />
  </div>
</div>
         <div style={styles.LanguageSelector}>
            <button
              onClick={handleMenuClick}
              style={styles.languageButton}
              aria-label={t.selectLanguage}
            >
              <Languages size={30} color="#c80505" />
            </button>

            <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose()}>
              <MenuItem onClick={() => handleMenuClose("fr")}>Français</MenuItem>
              <MenuItem onClick={() => handleMenuClose("en")}>English</MenuItem>
            </Menu>
          </div>
      </div>

      {error && <p style={styles.errorText}>{error}</p>}

      {user && (
        <>
          <div style={styles.geminiAi}>
            <div style={styles.topRow}>
              <label style={styles.label}>{t.heyNeedHelp}</label>
              <img src={wavingemoji} alt="Waving Emoji" style={styles.iconImage} />
            </div>
            <div style={styles.bottomRow}>
              <input
                type="text"
                placeholder={t.inputPlaceholder}
                style={styles.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div style={styles.micCircle} onClick={handleToggleMic} aria-label={t.voiceAssistantAria}>
              {micEnabled ? <Mic size={20} color="#333" /> : <MicOff size={20} color="#ccc" />}
            </div>
          </div>

         

          <motion.div
            style={styles.statsGrid}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: -10 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <StatCard
                name={t.trousDeCaisse}
                icon={PackageSearch}
                value={((totaleValeur - totaleEncaisse) * conversionRate).toFixed(2)}
                color="#c0392b"
              />
              <StatCard name={t.avance} icon={Users} value={(user.avance * conversionRate).toFixed(2)} color="#3498db" />
              <StatCard name={t.base} icon={ShoppingBag} value={user.base} color="#e67e22" />
              <AIAssistantCard />
            </div>
          </motion.div>

          <div style={styles.chartWrapper}>
            <div ref={chartRef} style={{ height: "400px" }} />
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  statsGrid: {},

  container: {
    padding: "5rem",
    marginLeft: "20%",
    marginTop: "-4rem",
    overflowX: "hidden",
  },
  chartWrapper: {
    marginBottom: "2rem",
    width: "70%",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    width:"100%"
  },
  titleBlock: { 
    textAlign: "left" ,
    marginBottom:"15%",

  },
  nameBlock: {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginLeft: '50%',
  marginBottom: '15%',
},
ProfileCircle: {
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  marginLeft: 'auto',
  zIndex: 999,
},
  secteur: {
    fontSize: "0.875rem",
    color: "#666",
    marginTop: "-1rem",
  },
  h1: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "black",
  },
  geminiAi: {
    width: "50%",
    position: "relative",
    left: "70%",
    marginTop: "1%",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.1rem",
  },
  bottomRow: { width: "100%" },
  label: {
    fontSize: "1.5rem",
    fontWeight: 500,
    color: "#444",
  },
  iconImage: {
    width: "24px",
    height: "24px",
  },
  input: {
    width: "50%",
    padding: "0.5rem 0",
    fontSize: "1rem",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
  },
  micCircle: {
    position: "absolute",
    top: "0",
    left: "40%",
    zIndex: 10,
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
  LanguageSelector: {
    margin: "1rem 0",
    width: "00%",
    marginBottom:"20%",
  },
  languageButton:{
    backgroundColor:"transparent",
    border:"none",
    cursor:"pointer",

  },
  select: {
    width: "100%",
    padding: "0.3rem",
    fontSize: "1rem",
    borderRadius: "5px",
  },
  errorText: {
    color: "red",
  },
  
};

export default UserInterface;
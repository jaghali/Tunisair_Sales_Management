import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import wavingemoji from "../components/Images/wavingemoji.png";
import { User, Mic, MicOff, ShoppingBag, Users, PackageSearch } from "lucide-react";
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";
import * as echarts from "echarts";
import EURFlag from "../components/Images/flags/Flag_of_Europe.svg.png";
import USDFlag from "../components/Images/flags/Flag_of_the_United_States.png";
import GBPFlag from "../components/Images/flags/Flag_of_the_United_Kingdom.png";
import TNDFlag from "../components/Images/flags/Flag_of_Tunisia.png";
import AIAssistantCard from "../components/AIAssistantCard";

const UserInterface = () => {
  const { matricule } = useParams();
  const navigate = useNavigate();

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
        setError("Impossible de charger les infos utilisateur.");
      } finally {
        setLoading(false);
      }
    };
    fetchPNInfo();
  }, [matricule]);

  useEffect(() => {
    const rates = { EUR: 1, USD: 1.07, GBP: 0.86, TND: 3.1 };
    setConversionRate(rates[selectedCurrency] || 1);
  }, [selectedCurrency]);

  useEffect(() => {
    if (chartRef.current && !loading) {
      const chartInstance = echarts.init(chartRef.current);
      const options = {
        title: { text: "Currency Conversion Over Time", left: "center" },
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
  }, [currencyChartData, selectedCurrency, loading]);

  if (loading) return <div style={styles.container}><p>Chargement...</p></div>;

  const currencyOptions = [
    { code: "EUR", name: "EUR (€)", flag: EURFlag },
    { code: "USD", name: "USD ($)", flag: USDFlag },
    { code: "GBP", name: "GBP (£)", flag: GBPFlag },
    { code: "TND", name: "TND (د.ت)", flag: TNDFlag },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.titleBlock}>
          <h1 style={styles.h1}>Financial</h1>
          <p style={styles.secteur}>Dashboards</p>
        </div>
        <div style={styles.nameBlock}>
          <h1 style={styles.h1}>{user ? `${user.prenom} ${user.nom}` : "Utilisateur"}</h1>
          <p style={styles.secteur}>{user?.college || ""}</p>
          <div style={styles.ProfileCircle} onClick={() => navigate(`/ProfilePage/${matricule}`)} aria-label="Profile">
            <User size={30} color="#333" />
          </div>
        </div>
      </div>

      {error && <p style={styles.errorText}>{error}</p>}

      {user && (
        <>
          <div style={styles.geminiAi}>
            <div style={styles.topRow}>
              <label style={styles.label}>Hey, need help ?</label>
              <img src={wavingemoji} alt="Waving Emoji" style={styles.iconImage} />
            </div>
            <div style={styles.bottomRow}>
              <input
                type="text"
                placeholder="Just ask me anything!"
                style={styles.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div style={styles.micCircle} onClick={handleToggleMic} aria-label="Voice Assistant">
              {micEnabled ? <Mic size={20} color="#333" /> : <MicOff size={20} color="#ccc" />}
            </div>
          </div>

          <div style={styles.currencySelector}>
            <select
              id="currency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              style={styles.select}
            >
              {currencyOptions.map((option) => (
                <option key={option.code} value={option.code}>{option.name}</option>
              ))}
            </select>
          </div>

          <motion.div
            style={styles.statsGrid}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: -10 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            
            <StatCard
              name="Trous de Caisse"
              icon={PackageSearch}
              value={((totaleValeur - totaleEncaisse) * conversionRate).toFixed(2)}
              color="#c0392b"
            />


              <StatCard name="Avance" icon={Users} value={user.avance * conversionRate} color="#3498db" />
              <StatCard name="Base" icon={ShoppingBag} value={user.base} color="#e67e22" />
              <AIAssistantCard/>
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
  statsGrid: {

  },
  
  container: {
    padding: "5rem",
    marginLeft: "15%",
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
  },
  titleBlock: { textAlign: "left" },
  nameBlock: { marginRight: "20%" },
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    cursor: "pointer",
  },
  ProfileCircle: {
    position: "relative",
    bottom: "50px",
    left: "180%",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    cursor: "pointer",
  },
  currencySelector: {
    margin: "2rem 0",
  },
  select: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
};

export default UserInterface;
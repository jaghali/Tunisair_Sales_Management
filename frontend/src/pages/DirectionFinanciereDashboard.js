import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as echarts from "echarts";
import { Wallet, Percent, User, Users, GridIcon, LineChartIcon } from "lucide-react";  
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion"; // Import motion
import { useCurrency } from "../pages/CurrencyContext";

const DirectionFinanciereDashboard = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [equipageData, setEquipageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("gallery");  // State for toggle
  const [selectedMonth, setSelectedMonth] = useState("");
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);
  function getCurrencySymbol(code) {
    switch (code) {
      case "TND":
        return "DT";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return code;
    }
  }
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/EtatVentesDepart/GroupByMonth");
        setGroupedData(res.data);

        const equipageRes = await axios.get("http://localhost:5000/api/ListeEquipageV");
        setEquipageData(equipageRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const selectedYear = selectedMonth ? parseInt(selectedMonth.split("-")[0]) : null;
  const selectedMonthNumber = selectedMonth ? parseInt(selectedMonth.split("-")[1]) : null;
  const totalValeurForSelectedMonth = groupedData
  .filter((item) => item.annee === selectedYear && item.mois === selectedMonthNumber)
  .reduce((acc, item) => acc + item.totalValeur, 0);

  const numberOfEquipage = equipageData.length;

  const commission14 = totalValeurForSelectedMonth * 0.14;
  const commission1 = (totalValeurForSelectedMonth * 0.01) + (commission14 / (numberOfEquipage || 1));
  
  useEffect(() => {
    if (!chartRef.current || !pieChartRef.current || groupedData.length === 0) return;

    const chart = echarts.init(chartRef.current);
    const pieChart = echarts.init(pieChartRef.current);

    const labels = groupedData.map((item) => `${item.mois}-${item.annee}`);
    const commission14Data = groupedData.map((item) => item.totalValeur * 0.14);
    const commission1Data = groupedData.map((item) => item.totalValeur * 0.01);

    const mainChartOptions = {
      title: {
        text: "Commissions Mensuelles par Mois",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        bottom: 0,
        data: ["Commission PNC", "Commission PNC Vendeur"],
      },
      xAxis: {
        type: "category",
        data: labels,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Commission PNC",
          type: view === "gallery" ? "bar" : "line",  // Switch between chart types based on view
          data: commission14Data,
          itemStyle: { color: "#3498db" },
        },
        {
          name: "Commission PNC Vendeur",
          type: view === "gallery" ? "bar" : "line",  // Switch between chart types based on view
          data: commission1Data,
          itemStyle: { color: "#e74c3c" },
        }
      ],
    };

    chart.setOption(mainChartOptions);

    const pieOptions = {
      title: {
        text: "Répartition des Commissions",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: 0,
      },
      series: [
        {
          name: "Commissions",
          type: "pie",
          radius: ["30%", "70%"],
          roseType: "area",
          data: [
            { value: commission14, name: "Commission PNC" },
            { value: commission1, name: "Commission PNC Vendeur" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          itemStyle: {
            color: (params) => {
              return params.name === "Commission PNC" ? "#3498db" : "#e74c3c";
            },
          },
        },
      ],
    };

    pieChart.setOption(pieOptions);

    const handleResize = () => {
      chart.resize();
      pieChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      pieChart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [groupedData, view, commission14, commission1]);

  return (
    <div style={styles.pageContainer}>
      
      <motion.div 
        style={styles.cardContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          style={{ ...styles.card, background: "transparent", boxShadow: "none" }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={styles.title}>Overview Page</h1>
          <div style={styles.monthSelectorWrapper}>
  <div style={styles.monthSelector}>
    <label htmlFor="month" style={styles.monthLabel}>
      📅 Choisir un mois :
    </label>
    <input
      type="month"
      id="month"
      onChange={handleMonthChange}
      value={selectedMonth}
      style={styles.monthInput}
    />
  </div>
</div>

          {loading ? (
            <p style={styles.loading}>Chargement...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : (
            <div style={styles.statRow}>
             <StatCard
                name="Totale Valeur"
                icon={Wallet}
                value={`${totalValeurForSelectedMonth.toFixed(2)} ${symbol}`}
                color="#27ae60"
                />
              
              <StatCard
                name="Commission Totale (14%)"
                icon={Percent}
                value={`${commission14.toFixed(2)} ${symbol}`}
                color="#3498db"
              />
              <StatCard
                name="Commission PNC Vendeur (1%)"
                icon={User}
                value={`${commission1.toFixed(2)} ${symbol}`}
                color="#e67e22"
              />
              <StatCard
                name="Nombre d'Équipage"
                icon={Users}
                value={numberOfEquipage}
                color="#9b59b6"
              />
            </div>
          )}
        </motion.div>

        {/* View toggle switch */}
        
        <motion.div 
          style={styles.chartRow}
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.cardchart}>
          <div style={styles.toggle}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end", // Align to the right
            borderRadius: "100px",
            backgroundColor: "#ff4d4d", // Default background red
            position: "relative",
            width: "140px",
            height: "32px",
            marginTop: "20px",  // Add some space from the stats
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              backgroundColor: "#ff0000", // Active state red
              borderRadius: "40px",
              transition: "transform 0.3s ease",
              transform: view === "gallery" ? "translateX(0)" : "translateX(100%)",
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              cursor: "pointer",
            }}
            onClick={() => setView("gallery")}
          >
            <GridIcon
              style={{
                color: view === "gallery" ? "white" : "#FFFFFF80",
              }}
            />
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              cursor: "pointer",
            }}
            onClick={() => setView("line")}
          >
            <LineChartIcon
              style={{
                color: view === "line" ? "white" : "#FFFFFF80",
              }}
            />
          </div>
        </div>
        </div>
            <h1 style={styles.title}>Graphique des Commissions Mensuelles</h1>
            <div ref={chartRef} style={{ height: "400px", width: "100%" }} />
          </div>

          <div style={styles.cardPie}>
            <h1 style={styles.title}>Répartition des Commissions</h1>
            <div ref={pieChartRef} style={{ height: "400px", width: "100%" }} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const styles = {
  monthSelectorWrapper: {
    position: "fixed",      // reste en haut à droite
    top: "20px",
    right: "20px",
    zIndex: 1000,           // reste au-dessus des autres éléments
  },
  
  monthSelector: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fff",
    padding: "10px 15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  
  monthLabel: {
    fontWeight: "600",
    color: "#2c3e50",
    fontSize: "14px",
  },
  
  monthInput: {
    padding: "6px 10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },
  
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: "15%",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "90%",
    maxWidth: "1400px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    width: "100%",
    textAlign: "center",
    border: "1px solid #e0e0e0",
    boxSizing: "border-box",
  },
  chartRow: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    width: "100%",
    flexWrap: "wrap",
  },
  cardchart: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    width: "65%",
    textAlign: "center",
    border: "1px solid #e0e0e0",
    boxSizing: "border-box",
  },
  cardPie: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    width: "30%",
    textAlign: "center",
    border: "1px solid #e0e0e0",
    boxSizing: "border-box",
  },
  title: {
    color: "#2c3e50",
    fontSize: "22px",
    marginBottom: "20px",
    fontWeight: "600",
  },
  loading: {
    color: "#2980b9",
  },
  error: {
    color: "#c0392b",
    fontWeight: "bold",
  },
  statRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  toggle:{
    marginLeft:"75%",
  }
};

export default DirectionFinanciereDashboard;

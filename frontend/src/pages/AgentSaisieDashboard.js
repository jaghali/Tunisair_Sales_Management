import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as echarts from "echarts";
import { Wallet, Users, LineChartIcon } from "lucide-react";  
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";
import { useCurrency } from "../pages/CurrencyContext";
const AgentSaisieDashboard = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [equipageData, setEquipageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("line"); // Only line chart now
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

  const sumEtatVentesDepart = groupedData.reduce((acc, curr) => acc + curr.totalValeur, 0);
  const numberOfEquipage = equipageData.length;

  useEffect(() => {
    if (!chartRef.current || !pieChartRef.current || groupedData.length === 0) return;

    const chart = echarts.init(chartRef.current);
    const pieChart = echarts.init(pieChartRef.current);

    const labels = groupedData.map((item) => `${item.mois}-${item.annee}`);
    const dataValues = groupedData.map((item) => item.totalValeur);

    const mainChartOptions = {
      title: {
        text: "",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        bottom: 0,
        data: ["Totale valeur de l'etat"],
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
          name: "Totale valeur de l'etat",
          type: "line", // Only line chart now
          data: dataValues,
          itemStyle: { color: "#3498db" },
        },
      ],
    };

    chart.setOption(mainChartOptions);

    const pieOptions = {
     
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: 0,
      },
      series: [
        {
          name: "Totale valeur de l'etat",
          type: "pie",
          radius: ["30%", "70%"],
          roseType: "area",
          data: [
            { value: sumEtatVentesDepart, name: "Totale valeur de l'etat" },
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
              return params.name === "Totale valeur de l'etat" ? "#3498db" : "#e74c3c";
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
  }, [groupedData]);

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
          <h1 style={styles.title}>Overview</h1>
          {loading ? (
            <p style={styles.loading}>Chargement...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : (
            <div style={styles.statRow}>
              <StatCard
                name="Total Valeur"
                icon={Wallet}
                value={`${sumEtatVentesDepart.toFixed(2)} ${symbol}`}
                color="#2ecc71"
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

        <motion.div 
          style={styles.chartRow}
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.cardchart}>
            <h1 style={styles.title}>Graphique des toteaux de valeurs</h1>
            <div ref={chartRef} style={{ height: "400px", width: "100%" }} />
          </div>

          <div style={styles.cardPie}>
            <h1 style={styles.title}>Répartition des toteaux de valeurs</h1>
            <div ref={pieChartRef} style={{ height: "400px", width: "100%" }} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const styles = {
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
};

export default AgentSaisieDashboard;

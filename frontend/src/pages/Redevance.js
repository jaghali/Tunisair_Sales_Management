import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCurrency } from "../pages/CurrencyContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { motion } from "framer-motion";
import StatCard from "../components/common/StatCard";
import { Wallet, Percent, User } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

const Redevance = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const { currency } = useCurrency();

  const getCurrencySymbol = (code) => {
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
  };
  const symbol = getCurrencySymbol(currency);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/EtatVentesDepart/GroupByMonth"
        );
        setGroupedData(res.data);
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

  useEffect(() => {
  if (!chartRef.current) return;

  const labels = groupedData.map((item) => `${item.mois}-${item.annee}`);
  const totalValeurData = groupedData.map((item) => item.totalValeur);
  const redevanceData = groupedData.map((item) => item.totalValeur * 0.85);
  const retenuData = groupedData.map((item) => item.totalValeur * 0.15);


  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Valeur",
        data: totalValeurData,
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Redevance (85%)",
        data: redevanceData,
        borderColor: "#2980b9",
        backgroundColor: "rgba(41, 128, 185, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Retenu (15%)",
        data: retenuData,
        borderColor: "#e67e22",
        backgroundColor: "rgba(41, 128, 185, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Redevance & Total Valeur Mensuelle",
      },
    },
  };

  if (chartInstanceRef.current) {
    chartInstanceRef.current.destroy();
  }

  chartInstanceRef.current = new ChartJS(chartRef.current, {
    type: "line",
    data: chartData,
    options: chartOptions,
  });
}, [groupedData, currency]);


  return (
    <div style={styles.pageContainer}>
      <motion.div
        style={{ ...styles.card, background: "transparent", boxShadow: "none" }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={styles.title}>Redevance</h1>

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
              name="Total Valeur:"
              icon={Wallet}
              value={`${totalValeurForSelectedMonth.toFixed(2)} ${symbol}`}
              color="#27ae60"
            />
            <StatCard
              name="Redevance (85%):"
              icon={Percent}
              value={`${(totalValeurForSelectedMonth * 0.85).toFixed(2)} ${symbol}`}
              color="#3498db"
            />
            <StatCard
              name="Retenue (15%):"
              icon={User}
              value={`${(totalValeurForSelectedMonth * 0.15).toFixed(2)} ${symbol}`}
              color="#e67e22"
            />
          </div>
        )}
        <div style={styles.chartContainer}>
          <canvas ref={chartRef} />
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  monthSelectorWrapper: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1000,
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
    padding: "40px",
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
    marginLeft: "3%",
  },
  chartContainer: {
    width: "90%",
    maxWidth: "800px",
    margin: "0 auto 30px",
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

export default Redevance;

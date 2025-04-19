import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
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

// Enregistrer les composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend);

const Redevance = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/EtatVentesDepart/GroupByMonth");
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

  const selectedData = groupedData.find(
    (item) => item.annee === selectedYear && item.mois === selectedMonthNumber
  );

  // Calculate the totalValeur sum for the selected month
  const totalValeurForSelectedMonth = groupedData
    .filter((item) => item.annee === selectedYear && item.mois === selectedMonthNumber)
    .reduce((acc, item) => acc + item.totalValeur, 0);

  useEffect(() => {
    if (!chartRef.current) return;

    const labels = groupedData.map((item) => `${item.mois}-${item.annee}`);
    const data = groupedData.map((item) => item.totalValeur * 0.85); // Redevance nette (après retenue)

    const chartData = {
      labels,
      datasets: [
        {
          label: "Redevance (85%)",
          data,
          borderColor: "#2980b9",
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
          text: "Redevance Mensuelle (après retenue)",
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
  }, [groupedData]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.calendarContainer}>
        <h2 style={styles.calendarTitle}>Choisir un mois :</h2>
        <input
          type="month"
          style={styles.select}
          onChange={handleMonthChange}
          value={selectedMonth}
        />
      </div>
  
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h1 style={styles.title}>Redevance</h1>
          {loading ? (
            <p style={styles.loading}>Chargement...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : (
            <>
              {selectedMonth && (
                <div style={styles.dataSection}>
                  <p style={styles.dataText}>
                    <strong>Total Valeur pour le mois sélectionné :</strong>{" "}
                    {totalValeurForSelectedMonth.toFixed(2)} TND
                  </p>
                  <p style={styles.dataText}>
                    <strong>Redevance (85%) :</strong>{" "}
                    {(totalValeurForSelectedMonth * 0.85).toFixed(2)} TND
                  </p>
                  <p style={styles.dataText}>
                    <strong>Retenue (15%) :</strong>{" "}
                    {(totalValeurForSelectedMonth * 0.15).toFixed(2)} TND
                  </p>
                </div>
              )}
            </>
          )}
        </div>
  
        <div style={styles.card}>
          <h1 style={styles.title}>Graphique des Redevances Mensuelles</h1>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
  
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  calendarContainer: {
    width: "100%",
    textAlign: "center",
    marginBottom: "30px",
  },
  calendarTitle: {
    fontSize: "18px",
    color: "#34495e",
    marginBottom: "15px",
    fontWeight: "600",
  },
  select: {
    width: "250px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "75%",
    maxWidth: "1200px",
    gap: "20px",
    marginTop: "20px",
    paddingLeft: "220px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    width: "45%",
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
  dataSection: {
    marginTop: "20px",
  },
  dataText: {
    fontSize: "18px",
    color: "#34495e",
    marginBottom: "12px",
  },
};

export default Redevance;

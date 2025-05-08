import { ShoppingBag, Users, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as echarts from "echarts";
import StatCard from "../components/common/StatCard";

const OverviewPage = () => {
  const [articleCount, setArticleCount] = useState(0);
  const [fournisseurCount, setFournisseurCount] = useState(0);
  const [pnCount, setPnCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);

useEffect(() => {
  if (!loading && !error) {
    setChartData([
      { value: articleCount, name: "Articles" },
      { value: fournisseurCount, name: "Fournisseurs" },
      { value: pnCount, name: "PN" },
    ]);
  }
}, [articleCount, fournisseurCount, pnCount, loading, error]);


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [articlesRes, fournisseursRes, pnRes] = await Promise.all([
          axios.get("http://localhost:5000/api/articles"),
          axios.get("http://localhost:5000/api/fournisseurs"),
          axios.get("http://localhost:5000/api/PN"),
        ]);

        animateCount(setArticleCount, articlesRes.data.length);
        animateCount(setFournisseurCount, fournisseursRes.data.length);
        animateCount(setPnCount, pnRes.data.length);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;
  
    const chart = echarts.init(chartRef.current);
    const option = {
      legend: {
        orient: "verticale",
        bottom: 0, 
        left: "left"
      },     
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: "Répartition",
          type: "pie",
          radius: [50, 250],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: { borderRadius: 8 },
          data: chartData, // ici on remplace
        },
      ],
    };
  
    chart.setOption(option);
    return () => chart.dispose();
  }, [chartData]); // dépendance ajoutée
  

  const animateCount = (setState, targetValue) => {
    let start = 0;
    const duration = 1000;
    const increment = targetValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        clearInterval(timer);
        setState(targetValue);
      } else {
        setState(Math.floor(start));
      }
    }, 16);
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
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
            {loading ? (
              <p style={styles.loading}>Chargement...</p>
            ) : error ? (
              <p style={styles.errorText}>{error}</p>
            ) : (
              <div style={styles.statRow}>
                <StatCard name="Total Articles" icon={PackageSearch} value={articleCount}color="#2ecc71"/>
                <StatCard name="Total Fournisseurs" icon={Users} value={fournisseurCount}color="#3498db"/>
                <StatCard name="Total PN" icon={ShoppingBag} value={pnCount}color="#e67e22" />
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Nightingale Pie Chart */}
        <div ref={chartRef} style={{ height: "500px", width: "100%", marginTop: "40px" }} />
        
      </main>
    </div>
  );
};

const styles = {
  container: {
    padding: "10%",
    marginLeft: "15%",
    marginTop: "-8%",
  },
  main: {
    margin: "0 auto",
    padding: "24px 16px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "120%",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "16px",
  },
  statRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "24px",
    flexWrap: "nowrap",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: "18px",
  },
  loading: {
    fontSize: "18px",
    color: "#888",
  },
};

export default OverviewPage;

import { BarChart2, ShoppingBag, Users, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../components/common/StatCard";

const OverviewPage = () => {
  const [articleCount, setArticleCount] = useState(0);
  const [fournisseurCount, setFournisseurCount] = useState(0);
  const [pnCount, setPnCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Function to animate the counter smoothly
  const animateCount = (setState, targetValue) => {
    let start = 0;
    const duration = 1000; // 1 second
    const increment = targetValue / (duration / 16); // 16ms per frame
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
        {loading ? (
          <p>Chargement des statistiques...</p>
        ) : error ? (
          <p style={styles.errorText}>{error}</p>
        ) : (
          <motion.div
            style={styles.statsGrid}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: -10 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {[{ name: "Total Articles", icon: PackageSearch, value: articleCount, color: "#C80505" },
              { name: "Total Fournisseurs", icon: Users, value: fournisseurCount, color: "#C80505" },
              { name: "Total PN", icon: ShoppingBag, value: pnCount, color: "#C80505" }
            ].map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <StatCard name={stat.name} icon={stat.icon} value={stat.value} color={stat.color} />
              </motion.div>
            ))}
          </motion.div>
        )}

<motion.div
            style={styles.statsGrid}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: -10 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {[{ name: "Total Articles", icon: PackageSearch, value: articleCount, color: "#C80505" },
            ].map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <StatCard name={stat.name} icon={stat.icon} value={stat.value} color={stat.color} />
              </motion.div>
            ))}
          </motion.div>
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
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "24px 16px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "32px",
    },
    errorText: {
      color: "red",
      textAlign: "center",
      fontSize: "18px",
    },
  };
  
  
export default OverviewPage;

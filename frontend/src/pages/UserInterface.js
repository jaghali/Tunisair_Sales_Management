import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import wavingemoji from "../components/Images/wavingemoji.png";
import { Mic, ShoppingBag, Users, PackageSearch } from "lucide-react";
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";

const UserInterface = () => {
  const { matricule } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPNInfo();
  }, [matricule]);

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
  <div style={styles.titleBlock}>
    <h1 style={styles.h1}>Financial</h1>
    <p style={styles.secteur}>Dashboard</p>
  </div>
  <div style={styles.nameBlock}>
    <h1 style={styles.h1}>
      {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
    </h1>
    <p style={styles.secteur}>
      {user ? `${user.secteur}` : ""}
    </p>
  </div>
</div>


      {error && <p style={styles.errorText}>{error}</p>}

      {user && (
        <>
          <div style={styles.geminiAi}>
            <div style={styles.topRow}>
              <label style={styles.label}>Hey, need help?</label>
              <img src={wavingemoji} alt="Waving Emoji" style={styles.iconImage} />
            </div>
            <div style={styles.bottomRow}>
              <input
                id="help"
                type="text"
                placeholder="Just ask me anything!"
                style={styles.input}
              />
            </div>
            <div style={styles.micCircle}>
              <Mic size={20} color="#333" />
            </div>
          </div>

          <div>
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
                {[
                  { name: "Salaire", icon: PackageSearch, value: user.salaire, color: "#C80505" },
                  { name: "Devance", icon: Users, value: user.devance, color: "#C80505" },
                  { name: "base", icon: ShoppingBag, value: user.base, color: "#C80505" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <StatCard
                      name={stat.name}
                      icon={stat.icon}
                      value={stat.value}
                      color={stat.color}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  
  titleBlock: {
    textAlign: "left",
  },

  nameBlock:{
    marginRight:"20%"
  },
  secteur: {
    fontSize: "0.875rem",
    color: "#666",
    marginTop: "-1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "2rem",
  },
  container: {
    padding: "5rem",
    marginLeft: "15%",
    marginTop: "-4rem",
    overflowX: "hidden", // Prevent horizontal scrolling
  },
  name: {
    marginLeft: "60%",
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
    marginTop: "7%",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.1rem",
  },
  bottomRow: {
    width: "100%",
  },
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
    borderBottom: "none",
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
  errorText: {
    color: "red",
    marginTop: "1rem",
  },
};

export default UserInterface;

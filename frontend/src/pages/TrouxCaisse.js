import React, { useState, useEffect } from "react";
import axios from "axios";

const TrouxCaisse = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/entetevente");
        setGroupedData(res.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const entetesAvecTrouDeCaisse = groupedData.filter(
    (entete) => entete.totaleEncaisse !== entete.totaleValeur
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}>Trous de Caisse</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : entetesAvecTrouDeCaisse.length > 0 ? (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>État N°</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>PNC</th>
                  <th style={styles.th}>Valeur</th>
                  <th style={styles.th}>Encaisse</th>
                  <th style={styles.th}>Écart</th>
                </tr>
              </thead>
              <tbody>
                {entetesAvecTrouDeCaisse.map((entete, index) => {
                  const ecart = entete.totaleEncaisse - entete.totaleValeur;
                  return (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>{entete.numerO_ETAT}</td>
                      <td style={styles.td}>
                        {new Date(entete.datE_EDITION).toLocaleDateString("fr-FR")}
                      </td>
                      <td style={styles.td}>{entete.pnC1}</td>
                      <td style={styles.td}>{entete.totaleValeur}</td>
                      <td style={styles.td}>{entete.totaleEncaisse}</td>
                      <td style={{ ...styles.td, color: ecart < 0 ? "green" : "red" }}>
                        {ecart}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucun trou de caisse détecté.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "#f1f3f6",
    minHeight: "100vh",
    padding: "20px",
  },
  contentWrapper: {
    marginLeft: "260px", // espace pour la sidebar
    width: "100%",
    maxWidth: "1000px",
  },
  title: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#2c3e50",
    fontWeight: "600",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "8px",
    boxShadow: "0 0 8px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#2c3e50",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
    fontWeight: "500",
  },
  td: {
    padding: "8px 10px",
    borderBottom: "1px solid #e0e0e0",
    color: "#333",
  },
  tr: {
    height: "40px",
  },
};

export default TrouxCaisse;

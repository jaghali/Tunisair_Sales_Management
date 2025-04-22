import React, { useState, useEffect } from "react";
import axios from "axios";

const Devances = () => {
  const [enteteVentes, setEnteteVentes] = useState([]);
  const [pnList, setPnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enteteRes = await axios.get("http://localhost:5000/api/entetevente");
        const pnRes = await axios.get("http://localhost:5000/api/PN");

        setEnteteVentes(enteteRes.data);
        setPnList(pnRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const entetesAvecTrouDeCaisse = enteteVentes.filter(
    (entete) => entete.totaleEncaisse !== entete.totaleValeur
  );

  const getSalaireForPN = (matricule) => {
    const matchedPN = pnList.find((pn) => pn.matricule === matricule);
    return matchedPN?.salaire ?? null;
  };

  const getDevanceForPN = (matricule) => {
    const matchedPN = pnList.find((pn) => pn.matricule === matricule);
    return matchedPN?.devance ?? null;
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}> Les Salaires Et Devances </h2>

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
                  <th style={styles.th}>Salaire Net</th>
                  <th style={styles.th}>Salaire Aprés Réduction</th>
                  <th style={styles.th}>Devance Aprés Réduction (x5)</th>
                  <th style={styles.th}>Reste De L'Ecart</th>
                </tr>
              </thead>
              <tbody>
                {entetesAvecTrouDeCaisse.map((entete, index) => {
                  const ecart = entete.totaleValeur - entete.totaleEncaisse ;
                  const salaire = getSalaireForPN(entete.pnC1);
                  const salaireMoinsEcart =salaire - ecart;
                    

                  const multipleDeCinq = Math.floor(ecart / 5) * 5;
                  const devance = getDevanceForPN(entete.pnC1);
                  const devanceRestante =
                    devance !== null ? (devance - multipleDeCinq).toFixed(2) : "N/A";

                  return (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>{entete.numerO_ETAT}</td>
                      <td style={styles.td}>
                        {new Date(entete.datE_EDITION).toLocaleDateString("fr-FR")}
                      </td>
                      <td style={styles.td}>{entete.pnC1}</td>
                      <td style={styles.td}>
                        {salaire !== null ? `${salaire} TND` : "N/A"}
                      </td>
                      <td style={styles.td}>
                        {salaire !== null ? `${salaireMoinsEcart} TND` : "N/A"}
                      </td>
              
                      <td style={styles.td}>
                        {devance !== null ? `${devanceRestante} TND` : "N/A"}
                      </td>
                      <td style={styles.td}>
                        {ecart-multipleDeCinq}
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

export default Devances;

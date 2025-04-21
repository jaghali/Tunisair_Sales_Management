import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Commission = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [equipageData, setEquipageData] = useState([]);
  const [etatVentes, setEtatVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [activeDetails, setActiveDetails] = useState(null);
  const [entetes, setEntetes] = useState([]);

  const chartRef = useRef(null);
  const pieChartRef = useRef(null);

  const filteredGroupedData = selectedMonth
  ? groupedData.filter(item => {
      const monthString = `${item.mois}-${item.annee}`;
      return monthString === selectedMonth;
    })
  : groupedData;

const filteredEtatVentes = selectedMonth
  ? etatVentes.filter(item => {
      const date = new Date(item.dateVente);
      const month = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
      return month === selectedMonth;
    })
  : etatVentes;

const sumFilteredEtatVentes = filteredEtatVentes.reduce((acc, curr) => acc + curr.valeur, 0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3, res4] = await Promise.all([
          axios.get("http://localhost:5000/api/EtatVentesDepart/GroupByMonth"),
          axios.get("http://localhost:5000/api/ListeEquipageV"),
          axios.get("http://localhost:5000/api/EtatVentesDepart"),
          axios.get("http://localhost:5000/api/EnteteVente"),
        ]);

        setGroupedData(res1.data);
        setEquipageData(res2.data);
        setEtatVentes(res3.data);
        setEntetes(res4.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getEtatVentesForMatricule = (matricule) => {
    return entetes.filter(entete => entete.pnC1 === matricule || entete.pnC2 === matricule);
  };  

  const filteredEquipage = selectedMonth
  ? equipageData.filter(equipage => {
      const matchingEntete = entetes.find(entete =>
        entete.pnC1 === equipage.matricule || entete.pnC2 === equipage.matricule
      );

      if (!matchingEntete || !matchingEntete.datE_EDITION) return false;

      const date = new Date(matchingEntete.datE_EDITION);
      const month = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;

      return month === selectedMonth;
    })
  : equipageData;
  
  const sumEtatVentesDepart = groupedData.reduce((acc, curr) => acc + curr.totalValeur, 0);
  const numberOfEquipage = equipageData.length;
  const numberOfFilteredEquipage = filteredEquipage.length;
  const commission14 = sumFilteredEtatVentes * 0.14;

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}>Filtrage par Mois</h2>
      <select
        style={{ padding: "10px", marginBottom: "20px" }}
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">-- Tous les mois --</option>
        {groupedData.map((item, index) => {
          const value = `${item.mois}-${item.annee}`;
          return (
            <option key={index} value={value}>
              {value}
            </option>
          );
        })}
      </select>

      <div style={styles.card}>
        <h3 style={styles.title}>Détails des PNC et leurs Commissions ({selectedMonth || "tous les mois"})</h3>
        {filteredEquipage.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#ecf0f1" }}>
                <th style={styles.th}>Matricule</th>
                <th style={styles.th}>PNC</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Commission (€)</th>
                <th style={styles.th}>Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipage.map((e, i) => {
                const isVendeu = entetes.some(entete => entete.pnC1 === e.matricule);
                const status = isVendeu ? "PNC VENDEUR" : "PNC";
                
                const isVendeur = status === "PNC VENDEUR";
                const commission = isVendeur
                  ? (sumEtatVentesDepart * 0.01 + commission14 / numberOfEquipage).toFixed(2)
                  : (commission14 / numberOfEquipage).toFixed(2);
                const isOpen = activeDetails === i;

                return (
                  <React.Fragment key={i}>
                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={styles.td}>{e.matricule}</td>
                      <td style={styles.td}>{e.pnc}</td>
                      <td style={styles.td}>{status}</td>
                      <td style={styles.td}>{commission}</td>
                      <td style={styles.td}>
                     <button
                     style={{ padding: "5px 10px", cursor: "pointer" }}
                     onClick={() => setActiveDetails(activeDetails === i ? null : i)}
                    >
                    {isOpen ? "Masquer" : "Détails"}
                    </button>
                    </td>

                    </tr>
                    {isOpen && (
  <tr>
    <td colSpan="5" style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
      <h4>États travaillés :</h4>
      {getEtatVentesForMatricule(e.matricule).length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#ddd" }}>
              <th style={styles.th}>Numéro État</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Commission (14%)</th>
            </tr>
          </thead>
          <tbody>
            {getEtatVentesForMatricule(e.matricule).map((entete, j) => (
              <tr key={j}>
                <td style={styles.td}>{entete.numerO_ETAT}</td>
                <td style={styles.td}>{entete.datE_EDITION}</td>
                <td style={styles.td}>{(entete.totaleEncaisse * 0.14 / (numberOfFilteredEquipage || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun état trouvé pour cet équipage.</p>
      )}
    </td>
  </tr>
)}


                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Aucun équipage trouvé pour ce mois.</p>
        )}
      </div>

      <div style={styles.chartRow}>
        <div ref={chartRef} style={{ width: "65%", height: "400px" }} />
        <div ref={pieChartRef} style={{ width: "30%", height: "400px" }} />
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
    alignItems: "center",
    marginLeft: "15%",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    margin: "20px 0",
    color: "#2c3e50",
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  th: {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "rgba(22, 21, 21, 0.1)",
    color: "black",
  },
  td: {
    padding: "10px",
    color: "black",
  },
  detailButton: {
    padding: "5px 10px",
    backgroundColor: "#2980b9",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  chartRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    width: "85%",
    marginTop: "30px",
  },
};

export default Commission;

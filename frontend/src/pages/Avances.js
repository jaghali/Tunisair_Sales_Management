import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCurrency } from "../pages/CurrencyContext";
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
function getCurrencyTaux(code) {
  switch (code) {
    case "TND":
      return 1;
    case "USD":
      return 2.97;
    case "EUR":
      return 3.37;
    case "GBP":
      return 3,96;
    default:
      return code;
  }
}

const Avances = () => {
  const [enteteVentes, setEnteteVentes] = useState([]);
  const [pnList, setPnList] = useState([]);
  const [tauxChange, setTauxChange] = useState([]);
  const [devises, setDevises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // ex: "2025-04"
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);
  const taux = getCurrencyTaux(currency);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enteteRes, pnRes, tauxRes, deviseRes] = await Promise.all([
          axios.get("http://localhost:5000/api/entetevente"),
          axios.get("http://localhost:5000/api/PN"),
          axios.get("http://localhost:5000/api/tauxchange"),
          axios.get("http://localhost:5000/api/Devise"),
        ]);

        setEnteteVentes(enteteRes.data);
        setPnList(pnRes.data);
        setTauxChange(tauxRes.data);
        setDevises(deviseRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const entetesAvecTrouDeCaisse = enteteVentes
  .filter((entete) => entete.totaleEncaisse !== entete.totaleValeur)
  .filter((entete) => {
    if (!selectedMonth) return true; // Aucun filtre si aucun mois sélectionné
    const dateEdition = new Date(entete.datE_EDITION);
    const yearMonth = `${dateEdition.getFullYear()}-${String(dateEdition.getMonth() + 1).padStart(2, "0")}`;
    return yearMonth === selectedMonth;
  });

  const getAvanceForPN = (matricule) => {
    return pnList.find((pn) => pn.matricule === matricule)?.avance ?? null;
  };

  const exportToTxt = () => {
    let content = "État N° | Date | PNC | Réduction (TND) | Avance Après Réduction (TND) | Reste De L'Ecart\n";
    content += "-----------------------------------------------------------------------------------------\n";
  
    entetesAvecTrouDeCaisse.forEach((entete) => {
      const ecart = entete.totaleValeur - entete.totaleEncaisse;
      const multipleDeCinq = Math.floor(ecart / 5) * 5;
      const avance = getAvanceForPN(entete.pnC1);
      const avanceRestante = avance !== null ? avance - multipleDeCinq : null;
      const ecartEnTND = ecart * taux;
      const avanceRestanteEnTND = avanceRestante !== null ? avanceRestante : null;
  
      const line = `${entete.numerO_ETAT} | ${new Date(entete.datE_EDITION).toLocaleDateString("fr-FR")} | ${entete.pnC1} | ${ecartEnTND.toFixed(2)} | ${avanceRestanteEnTND !== null ? avanceRestanteEnTND.toFixed(2) : "N/A"} | ${(ecart - multipleDeCinq).toFixed(2)}\n`;
      content += line;
    });
  
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Avances.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
      <div style={{ marginBottom: "20px" }}>
  <label style={{ marginRight: "10px", fontWeight: "500", fontSize: "16px",color:"black"  }}>Filtrer par mois:</label>
  <input
    type="month"
    value={selectedMonth}
    style={styles.calendarInput}
    onChange={(e) => setSelectedMonth(e.target.value)}
    onFocus={(e) => (e.target.style.borderColor = "#3498db")}
    onBlur={(e) => (e.target.style.borderColor = "#ccc")}
  />
</div>

        <h2 style={styles.title}>Avance en devise</h2>
        <button onClick={exportToTxt} style={styles.exportButton}>
        Exporter en TXT
        </button>
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
                  <th style={styles.th}>Trous de caisse</th>
                  <th style={styles.th}>Réduction</th>
                  <th style={styles.th}>Avance Aprés Réduction (x5)</th>
                  <th style={styles.th}>Reste De L'Ecart</th>
                </tr>
              </thead>
              <tbody>
  {entetesAvecTrouDeCaisse.map((entete, index) => {
    const ecart = entete.totaleValeur - entete.totaleEncaisse;
    const multipleDeCinq = Math.floor(ecart / 5) * 5;
    const avance = getAvanceForPN(entete.pnC1);
    const avanceRestante = avance !== null ? avance - multipleDeCinq : null;

    // Conversion en Dinar
    const ecartEnTND = ecart * taux;
    const avanceRestanteEnTND = avanceRestante !== null ? avanceRestante : null; // avance est déjà en TND

    return (
      <tr key={index} style={styles.tr}>
        <td style={styles.td}>{entete.numerO_ETAT}</td>
        <td style={styles.td}>
          {new Date(entete.datE_EDITION).toLocaleDateString("fr-FR")}
        </td>
        <td style={styles.td}>{entete.pnC1}</td>
        <td style={styles.td}>
          {ecart.toFixed(2)} {symbol}
        </td>
        {/* Réduction toujours en Dinar */}
        <td style={styles.td}>
          {ecartEnTND.toFixed(2)} {'TND'}
        </td>

        {/* Avance restante aussi en Dinar */}
        <td style={styles.td}>
          {avanceRestanteEnTND !== null
            ? `${avanceRestanteEnTND.toFixed(2)} €`
            : "N/A"}
        </td>

        {/* Le reste (trou) affiché brut */}
        <td style={styles.td}>
          {(ecart - multipleDeCinq).toFixed(2)}
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
  calendarInput: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    fontSize: "14px",
    outline: "none",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  calendarInputFocus: {
    borderColor: "#3498db",
    boxShadow: "0 0 5px rgba(52, 152, 219, 0.5)",
  },
  
  exportButton: {
    marginBottom: "15px",
    padding: "8px 16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  
  contentWrapper: {
    marginLeft: "260px",
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

export default Avances;

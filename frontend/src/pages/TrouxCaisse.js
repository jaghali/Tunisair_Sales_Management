import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCurrency } from "../pages/CurrencyContext";
import {InputAdornment, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const TrouxCaisse = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);

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

  const filteredData = entetesAvecTrouDeCaisse.filter((entete) =>
    entete.pnC1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entete.numerO_ETAT?.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}>Trous de Caisse</h2>
<TextField
      label="Rechercher..."
      variant="standard"
      fullWidth
      style={styles.searchInput}
 onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}      InputLabelProps={{ style: { color: "#3D3D3D" } }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon style={{ color: "gray" }} />
          </InputAdornment>
        ),
        sx: {
          "&:before": { borderBottom: "2px solid #3D3D3D" },
          "&:hover:before": { borderBottom: "2px solid red" },
          "&:after": { borderBottom: "2px solid red" },
        },
      }}
    />
        

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p style={{ color: "#C80505" }}>{error}</p>
        ) : filteredData.length > 0 ? (
          <>
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
                  {paginatedData.map((entete, index) => {
                    const ecart = entete.totaleValeur - entete.totaleEncaisse;
                    return (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}>{entete.numerO_ETAT}</td>
                        <td style={styles.td}>
                          {new Date(entete.datE_EDITION).toLocaleDateString("fr-FR")}
                        </td>
                        <td style={styles.td}>{entete.pnC1}</td>
                        <td style={styles.td}>
                          {entete.totaleValeur} {symbol}
                        </td>
                        <td style={styles.td}>
                          {entete.totaleEncaisse} {symbol}
                        </td>
                        <td style={{ ...styles.td, color: ecart < 0 ? "green" : "red" }}>
                          {ecart} {symbol}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={styles.pageButton}
              >
                ←
              </button>
              <span style={styles.pageNumber}>
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={styles.pageButton}
              >
                →
              </button>
            </div>
          </>
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
    marginLeft: "25%",
    width: "100%",
    maxWidth: "1000px",

  },
  title: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#2c3e50",
    fontWeight: "600",
  },
 searchInput: {
  maxWidth: "200px",
  marginRight: "10px",
  marginBottom: "20px", 
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
    backgroundColor: "#2C3E50",
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
  pagination: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  pageButton: {
    padding: "5px 10px",
    backgroundColor: "#2C3E50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  pageNumber: {
    fontSize: "14px",
  },
};

export default TrouxCaisse;

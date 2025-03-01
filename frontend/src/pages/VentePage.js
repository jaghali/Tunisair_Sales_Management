import React, { useState, useEffect } from "react";
import axios from "axios";
import EtatVentesDepartTable from "../components/EtatVentesDepartTable";
import EtatVentesArriveeTable from "../components/EtatVentesArriveeTable";
import { useNavigate } from "react-router-dom";

const VentePage = () => {
  const [venteDetails, setVenteDetails] = useState([]);
  const [venteEtatArrivee, setVenteEtatArrivee] = useState([]);
  const [venteEtatDepart, setVenteEtatDepart] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetching the data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [response, etatArriveeResponse, etatDepartResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/ListeEquipageV"),
          axios.get("http://localhost:5000/api/AgentSaisie/EtatVentesArrivee"),
          axios.get("http://localhost:5000/api/AgentSaisie/EtatVentesDepart"),
        ]);

        setVenteDetails(response.data);
        setVenteEtatArrivee(etatArriveeResponse.data);
        setVenteEtatDepart(etatDepartResponse.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchDetails();
  }, []);

  // Handle detail view navigation
  const handleDetailClick = (id) => {
    navigate(`/ventePage/${id}`);
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Détails des Ventes</h2>

      {/* Table for VenteDetails */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>PNC</th>
            <th style={styles.headerCell}>Matricule</th>
            <th style={styles.headerCell}>Données</th>
            <th style={styles.headerCell}>Générales</th>
          </tr>
        </thead>
        <tbody>
          {venteDetails.map((vente, index) => (
            <tr key={index} style={styles.row}>
              <td style={styles.cell}>{vente.pnc}</td>
              <td style={styles.cell}>{vente.matricule}</td>
              <td style={styles.cell}>{vente.donnees}</td>
              <td style={styles.cell}>{vente.generales}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render both tables */}
      <EtatVentesArriveeTable data={venteEtatArrivee} onDetailClick={handleDetailClick} />
      <EtatVentesDepartTable data={venteEtatDepart} onDetailClick={handleDetailClick} />
    </div>
  );
};

const styles = {
  container: {
    padding: "5%",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#c80505",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  headerRow: {
    backgroundColor: "#c80505",
    color: "#fff",
  },
  headerCell: {
    padding: "12px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
  },
  row: {
    transition: "background 0.3s",
  },
  cell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
};

export default VentePage;

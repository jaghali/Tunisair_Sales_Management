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
          axios.get("http://localhost:5000/api/EtatVentesArrivee"),
          axios.get("http://localhost:5000/api/EtatVentesDepart"),
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
      <h2 style={styles.heading}>Liste d'Equipages</h2>

      {/* Table for Liste Equipage */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>PNC</th>
            <th style={styles.headerCell}>Matricule</th>
          </tr>
        </thead>
        <tbody>
          {venteDetails.map((vente, index) => (
            <tr key={index} style={styles.row}>
              <td style={styles.cell}>{vente.pnc}</td>
              <td style={styles.cell}>{vente.matricule}</td>
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
    padding: "2%", 
    maxWidth: "1000px", 
    margin: "0 auto",
 
  },
  heading: {
    textAlign: "center",
    fontSize: "1.5rem", 
    fontWeight: "700",
    color: "#b71c1c",
    marginBottom: "1rem", 
    letterSpacing: "0.5px", 
  },
  table: {
    width: "70%", 
    borderCollapse: "separate",
    borderSpacing: "0",
    marginTop: "1rem", 
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
    borderRadius: "8px", 
    overflow: "hidden",
    marginLeft: "auto", 
    marginRight: "auto",
  },
  headerRow: {
    backgroundColor: "#b71c1c",
    color: "#ffffff",
  },
  headerCell: {
    padding: "0.8rem", 
    fontSize: "0.9rem", 
    fontWeight: "600",
    borderBottom: "2px solid #880e0e", 
    textAlign: "left",
  },
  row: {
    transition: "background 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  cell: {
    padding: "0.7rem", 
    fontSize: "0.85rem", 
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    color: "#333",
  },
  actionButtons: {
    display: "flex",
    gap: "0.4rem", 
  },
};


export default VentePage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import EtatOffreArriveeTable from "../components/EtatOffreArriveeTable";
import { useNavigate } from "react-router-dom";

const OffrePageArr = () => {
  const [offreEtatArrivee, setOffreEtatArrivee] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetching the data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const etatArriveeResponse = await axios.get("http://localhost:5000/api/EtatOffresArrivee");
        setOffreEtatArrivee(etatArriveeResponse.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchDetails();
  }, []);

  // Handle detail view navigation
  const handleDetailClick = (id) => {
    navigate(`/offrePage/${id}`);
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div style={styles.container}>
      <EtatOffreArriveeTable data={offreEtatArrivee} onDetailClick={handleDetailClick} />
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

export default OffrePageArr;

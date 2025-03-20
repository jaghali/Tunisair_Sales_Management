import React, { useState, useEffect } from "react";
import axios from "axios";
import Articles from "../components/Articles"; 
import { useNavigate } from "react-router-dom";
import "../App.css";

const ArticlesPage = () => {
  const [venteDetails, setVenteDetails] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetching the data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/Articles");
        setVenteDetails(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchDetails();
  }, []);

  // Handle detail view navigation
  const handleDetailClick = (id) => {
    navigate(`/Articles/${id}`); 
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div style={styles.container}>
      {/* Render Articles component with correct props */}
      <Articles data={venteDetails} onDetailClick={handleDetailClick} />
    </div>
  );
};

const styles = {
  container: {
         padding: "10%", marginLeft:"15%" , marginTop:"-8%"
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
  
  cell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
};

export default ArticlesPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Fournisseurs from "../components/Fournisseur"; 
import { useNavigate } from "react-router-dom";
import "../App.css";

const FournisseurPage = () => {
  const [venteDetails, setVenteDetails] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetching the data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/Fournisseurs");
        setVenteDetails(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchDetails();
  }, []);

  // Handle detail view navigation
  const handleDetailClick = (id) => {
    navigate(`/Fournisseurs/${id}`); 
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
   
    <div  style={{ padding: "10%", marginLeft:"15%" , marginTop:"-8%"}}>
      <Fournisseurs data={venteDetails} onDetailClick={handleDetailClick} />
    </div>
  );
};



export default FournisseurPage;

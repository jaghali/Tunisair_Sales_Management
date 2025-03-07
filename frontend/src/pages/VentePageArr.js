import React, { useState, useEffect } from "react";
import axios from "axios";
import EtatVentesArriveeTable from "../components/EtatVentesArriveeTable";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const VentePageArr = () => {
  const [venteDetails, setVenteDetails] = useState([]);
  const [venteEtatArrivee, setVenteEtatArrivee] = useState([]);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  // Fetching the data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [response, etatArriveeResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/ListeEquipageV"),
          axios.get("http://localhost:5000/api/EtatVentesArrivee"),
        ]);

        setVenteDetails(response.data);
        setVenteEtatArrivee(etatArriveeResponse.data);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div style={{ padding: "2%", maxWidth: "1000px", margin: "0 auto" }}>
        <Tabs value={tabValue} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example" onChange={handleTabChange} centered>
        <Tab label="Liste Equipage" />
        <Tab label="État Ventes Arrivée" />
      </Tabs>
      {tabValue === 0 && (
        <table style={{ width: "70%", borderCollapse: "collapse", marginTop: "1rem", marginLeft: "auto", marginRight: "auto", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#b71c1c", color: "#ffffff" }}>
              <th style={{ padding: "0.8rem", fontSize: "0.9rem", fontWeight: "600", borderBottom: "2px solid #880e0e", textAlign: "left" }}>PNC</th>
              <th style={{ padding: "0.8rem", fontSize: "0.9rem", fontWeight: "600", borderBottom: "2px solid #880e0e", textAlign: "left" }}>Matricule</th>
            </tr>
          </thead>
          <tbody>
            {venteDetails.map((vente, index) => (
              <tr key={index} style={{ transition: "background 0.3s ease-in-out" }}>
                <td style={{ padding: "0.7rem", fontSize: "0.85rem", borderBottom: "1px solid #ddd", textAlign: "left", color: "#333" }}>{vente.pnc}</td>
                <td style={{ padding: "0.7rem", fontSize: "0.85rem", borderBottom: "1px solid #ddd", textAlign: "left", color: "#333" }}>{vente.matricule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tabValue === 1 && <EtatVentesArriveeTable data={venteEtatArrivee} onDetailClick={handleDetailClick} />}
    </div>
  );
};

export default VentePageArr;

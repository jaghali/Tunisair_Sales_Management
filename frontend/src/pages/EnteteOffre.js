import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../App.css"; 

const EnteteOffre = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/EnteteOffre");
        setData(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDetailClick = () => {
    navigate(`/OffrePage`);
  };

  return (
    <div className="container">
      <h2 className="heading">Entête des Offres</h2>

      <div className="button-container">
        <Button variant="contained" color="primary" onClick={handleDetailClick}>
          Voir Détails
        </Button>
      </div>

      {loading && (
        <div className="loader-container">
          <svg viewBox="0 0 37 37" height="50" width="50">
            <path className="track" fill="none" strokeWidth="5" pathLength="100" d="M36.63 31.746 c0 -13.394 -7.326 -25.16 -18.13 -31.376 C7.696 6.66 0.37 18.352 0.37 31.746 c5.328 3.108 11.544 4.884 18.13 4.884 S31.302 34.854 36.63 31.746z" />
            <path className="car" fill="none" strokeWidth="5" pathLength="100" d="M36.63 31.746 c0 -13.394 -7.326 -25.16 -18.13 -31.376 C7.696 6.66 0.37 18.352 0.37 31.746 c5.328 3.108 11.544 4.884 18.13 4.884 S31.302 34.854 36.63 31.746z" />
          </svg>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="header-row">
                <th className="header-cell">PNC</th>
                <th className="header-cell">MATRICULE</th>
                <th className="header-cell">Données</th>
                <th className="header-cell">Générales</th>
                
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id} className="row">
                    <td className="cell">{row.pnc}</td>
                    <td className="cell">{row.matricule}</td>
                    <td className="cell">{row.donnees}</td>
                    <td className="cell">{row.destination}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="no-data">Aucune donnée trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnteteOffre;

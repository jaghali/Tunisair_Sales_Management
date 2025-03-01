import React, { useState, useEffect } from "react";
import axios from "axios";
import EtatOffresDepartTable from "../components/EtatOffresDepartTable";
import EtatOffreArriveeTable from "../components/EtatOffreArriveeTable";
import { useNavigate } from "react-router-dom";

const OffrePage = () => {
  //const [offreDetails, setOffreDetails] = useState([]);
  const [offreEtatArrivee, setOffreEtatArrivee] = useState([]);
  const [offreEtatDepart, setOffreEtatDepart] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetching the data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        //const response = await axios.get("http://localhost:5000/api/ListeEquipageO/");
        const etatArriveeResponse = await axios.get("http://localhost:5000/api/AgentSaisie/EtatOffresArrivee");
        const etatDepartResponse = await axios.get("http://localhost:5000/api/AgentSaisie/EtatOffresDepart");

        //setOffreDetails(response.data);
        setOffreEtatArrivee(etatArriveeResponse.data);
        setOffreEtatDepart(etatDepartResponse.data);
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
    <div style={containerStyle}>
      <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">Détails des Offres</h2>

      {/* Table for OffreDetails */}
      <table className="min-w-full mb-6 border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">PNC</th>
            <th className="border px-4 py-2">Matricule</th>
            <th className="border px-4 py-2">Données</th>
            <th className="border px-4 py-2">Générales</th>
          </tr>
        </thead>
        {/* <tbody>
          {offreDetails.map((offre, index) => (
            <tr key={index} className="border text-center hover:bg-gray-100">
              <td className="border px-4 py-2">{offre.pnc}</td>
              <td className="border px-4 py-2">{offre.matricule}</td>
              <td className="border px-4 py-2">{offre.donnees}</td>
              <td className="border px-4 py-2">{offre.generales}</td>
            </tr>
          ))}
        </tbody> */}
      </table>

      {/* Render both tables without toggling */}
      <EtatOffreArriveeTable data={offreEtatArrivee} onDetailClick={handleDetailClick} />
      <EtatOffresDepartTable data={offreEtatDepart} onDetailClick={handleDetailClick} />
    </div>
  );
};

const containerStyle = {
  padding: "5%",
};

export default OffrePage;

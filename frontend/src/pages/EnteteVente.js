import React, { useEffect, useState } from "react";
import axios from "axios";
import "../EnteteOffre.css";
import { useNavigate } from "react-router-dom";

const EnteteVente = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/EnteteVente");  
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
    navigate("/agent-saisie-dashboard");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">Entête des Ventes</h2>

      {loading && <p className="text-center text-gray-500">Chargement en cours...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Bouton "Détail" à l'extérieur du tableau */}
      <div className="button-container">
        <button 
          className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 shadow-md"
          onClick={handleDetailClick}
        >
          Détail
        </button>
      </div>

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-black text-white uppercase text-sm leading-normal">
                <th className="border px-4 py-2">PNC</th>
                <th className="border px-4 py-2">MATRICULE</th>
                <th className="border px-4 py-2">DONNÉES</th>
                <th className="border px-4 py-2">GÉNÉRALES</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index} className={`text-center border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                    <td className="border px-4 py-2 font-medium">{row.pnc}</td>
                    <td className="border px-4 py-2">{row.matricule}</td>
                    <td className="border px-4 py-2">{row.donnees}</td>
                    <td className="border px-4 py-2">{row.generales}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">Aucune donnée trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnteteVente;

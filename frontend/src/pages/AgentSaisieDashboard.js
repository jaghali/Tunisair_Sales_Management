import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./AgentSaisieDashboard.css";

const AgentSaisieDashboard = () => {
  const [selectedTable, setSelectedTable] = useState("EtatVentesArrivee");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fonction pour récupérer les données de la table sélectionnée
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/AgentSaisie/${selectedTable}`);
      console.log("Données récupérées :", response.data); // Affichage des données récupérées après la mise à jour

      if (response.data.length > 0) {
        setColumns(Object.keys(response.data[0]));
      } else {
        console.log("Aucune donnée pour cette table.");
      }

      setData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, [selectedTable]);

  // Mise à jour des données après modification
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    console.log("Les données ont été mises à jour :", data); // Vérification de la mise à jour des données
  }, [data]);

  const handleDelete = async (code) => {
    if (!code) {
      console.error("Code invalide pour la suppression");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/AgentSaisie/${selectedTable}/${code}`);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code) {
      alert("Le champ Code est requis !");
      return;
    }

    console.log("Nouveaux détails saisis :", formData);

    try {
      if (isEditing && editId) {
        console.log("Modification de l'élément avec ID :", editId);
        await axios.put(
          `http://localhost:5000/api/AgentSaisie/${selectedTable}/${editId}`,
          formData, 
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(response => {
          console.log('Données mises à jour avec succès:', response.data);
          fetchUsers();  // Appel à fetchUsers pour récupérer les nouvelles données
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour:', error);
        });
      } else {
        // Ajout d'un nouvel élément si ce n'est pas une modification
        console.log("Ajout d'un nouvel élément");
        await axios.post(
          `http://localhost:5000/api/AgentSaisie/${selectedTable}`,
          formData,
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(response => {
          console.log('Élément ajouté avec succès:', response.data);
          fetchUsers();  // Appel à fetchUsers pour récupérer les nouvelles données
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout:', error);
        });
      }

      setFormData({}); // Réinitialisation du formulaire
      setShowForm(false); // Fermeture du formulaire après soumission
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
    }
  };

  const handleEdit = (item) => {
    const code = item.code;

    if (!code) {
      console.error("Impossible de modifier, Code manquant :", item);
      return;
    }

    console.log("Modification de l'élément :", item);
    console.log("Code détecté :", code);

    setIsEditing(true);
    setEditId(code);
    setFormData({ ...item }); // Copie des données pour éviter les modifications directes
    setShowForm(true);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({});
    setShowForm(true);
  };

  return (
    <div className="dashboard">
      <h1>Tableau de bord - Agent de saisie</h1>

      <select onChange={(e) => setSelectedTable(e.target.value)} value={selectedTable}>
        <option value="EtatVentesArrivee">Etat de ventes arrivée</option>
        <option value="EtatVentesDepart">Etat de ventes départ</option>
        <option value="EtatOffresArrivee">Etat d'offres arrivée</option>
        <option value="EtatOffresDepart">Etat d'offres départ</option>
      </select>

      <button onClick={handleAddNew}>Ajouter un nouvel élément</button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h3>{isEditing ? "Modifier l'élément" : "Ajouter un élément"}</h3>
          {columns.map((col) => (
            <input
              key={col}
              name={col}
              placeholder={col}
              value={formData[col] || ""}
              onChange={handleInputChange}
            />
          ))}
          <button type="submit">{isEditing ? "Modifier" : "Ajouter"}</button>
          <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
        </form>
      )}

      <div className="table-container">
        {data.length > 0 ? (
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const code = item.code;

                return (
                  <tr key={code || index}>
                    {columns.map((col) => (
                      <td key={col}>{item[col]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(item)}>Modifier</button>
                        {code && <button onClick={() => handleDelete(code)}>Supprimer</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Aucune donnée à afficher.</p>
        )}
      </div>
    </div>
  );
};

export default AgentSaisieDashboard;

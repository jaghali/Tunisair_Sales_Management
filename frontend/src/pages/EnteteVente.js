import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Edit, Trash, Save, X } from "lucide-react";
import EnteteVenteForm from "../components/EnteteVenteForm";

import "../App.css"; 

const EnteteVente = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [openForm, setOpenForm] = useState(false); 

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
    navigate(`/ventePage`);
  };

  const handleEdit = (item) => {
    setIsEditing(item.id);
    setEditedItem({ ...item });
    
  };

  const handleSaveEdit = async (newData) => {
    try {
      await axios.put(`http://localhost:5000/api/EnteteVente/${newData.id}`, newData);
      setData(data.map((row) => (row.id === newData.id ? newData : row)));
      setIsEditing(null);
      setEditedItem(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour !");
    }
  };

  const handleAddNew = (newData) => {
    try {
      axios.post("http://localhost:5000/api/EnteteVente", newData)
        .then(response => {
          setData([...data, response.data]);
          setOpenForm(false); // Close form after adding
        });
    } catch (err) {
      alert("Erreur lors de l'ajout !");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedItem(null);
    setOpenForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/EnteteVente/${id}`);
        setData(data.filter((row) => row.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression !");
      }
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Entête des Ventes</h2>

      <div className="button-container">
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
          Ajouter Etat De Vente
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
                <th className="header-cell">AVION</th>
                <th className="header-cell">AIROPORT</th>
                <th className="header-cell">DATE_EDITION</th>
                <th className="header-cell">NUMERO_ETAT</th>
                <th className="header-cell">PNC_1</th>
                <th className="header-cell">Actions</th>
                <th className="header-cell">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id} className="row">
                    <td className="cell">
                      {isEditing === row.id ? (
                        <input
                          type="text"
                          value={editedItem.avion}
                          onChange={(e) => setEditedItem({ ...editedItem, avion: e.target.value })}
                        />
                      ) : (
                        row.avion
                      )}
                    </td>
                    <td className="cell">
                      {isEditing === row.id ? (
                        <input
                          type="text"
                          value={editedItem.airoport}
                          onChange={(e) => setEditedItem({ ...editedItem, airoport: e.target.value })}
                        />
                      ) : (
                        row.airoport
                      )}
                    </td>
                    <td className="cell">{row.datE_EDITION}</td>
                    <td className="cell">
                      {isEditing === row.id ? (
                        <input
                          type="text"
                          value={editedItem.numerO_ETAT}
                          onChange={(e) => setEditedItem({ ...editedItem, numerO_ETAT: e.target.value })}
                        />
                      ) : (
                        row.numerO_ETAT
                      )}
                    </td>
                    <td className="cell">
                      {isEditing === row.id ? (
                        <input
                          type="text"
                          value={editedItem.pnC1}
                          onChange={(e) => setEditedItem({ ...editedItem, pnC1: e.target.value })}
                        />
                      ) : (
                        row.pnC1
                      )}
                    </td>

                    <td className="cell">
                      {isEditing === row.id ? (
                        <>
                          <Save onClick={() => handleSaveEdit(editedItem)} style={{ ...styles.icon, color: "green" }} />
                          <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red" }} />
                        </>
                      ) : (
                        <>
                          <Edit onClick={() => handleEdit(row)} style={{ ...styles.icon, color: "#00a3f5" }} />
                          <Trash onClick={() => handleDelete(row.id)} style={{ ...styles.icon, color: "#e74c3c" }} />
                        </>
                      )}
                    </td>
                    <td className="cell"><Button onClick={handleDetailClick}>View More ...</Button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">Aucune donnée trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog for Add Form Only */}
      <Dialog open={openForm} onClose={handleCancelEdit}>
        <DialogTitle>Ajouter Etat De Vente</DialogTitle>
        <DialogContent>
          <EnteteVenteForm
            onClose={handleCancelEdit}
            onSave={handleAddNew} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = {
  icon: {
    cursor: "pointer",
    marginRight: "8px",
  },
};

export default EnteteVente;

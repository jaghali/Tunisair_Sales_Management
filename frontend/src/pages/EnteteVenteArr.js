import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Plus , Edit, Trash, Save, X } from "lucide-react";
import EnteteVenteForm from "../components/EnteteVenteForm";
import { motion } from 'framer-motion';

import "../App.css"; 

const EnteteVenteArr = () => {
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
    navigate(`/ventePagearr`);
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
    <div style={styles.container}>
      <h2 style={styles.heading}>Etat Des Ventes Arrivée</h2>

     
      <motion.button
          onClick={() => setOpenForm(true)}
          style={styles.addButton}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
  >
    <Plus style={styles.icon} />
    Ajouter Etat De Vente
    </motion.button>
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
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.headerCell}>AVION</th>
                <th style={styles.headerCell}>AIROPORT</th>
                <th style={styles.headerCell}>DATE_EDITION</th>
                <th style={styles.headerCell}>NUMERO_ETAT</th>
                <th style={styles.headerCell}>PNC_1</th>
                <th style={styles.headerCell}>Actions</th>
                <th style={styles.headerCell}>Details</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id} className="row">
                    <td style={styles.cell}>
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
                    <td style={styles.cell}>
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
                    <td style={styles.cell}>{row.datE_EDITION}</td>
                    <td style={styles.cell}>
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
                    <td style={styles.cell}>
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

                    <td style={styles.cell}>
                      {isEditing === row.id ? (
                        <>
                          <Save onClick={() => handleSaveEdit(editedItem)} style={{ ...styles.icon,  color: "#00a3f5" , cursor:"pointer"}} />
                          <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red" , cursor:"pointer"}} />
                        </>
                      ) : (
                        <>
                          <Edit onClick={() => handleEdit(row)} style={{ ...styles.icon, color: "#00a3f5", cursor:"pointer" }} />
                          <Trash onClick={() => handleDelete(row.id)} style={{ ...styles.icon, color: "#e74c3c", cursor:"pointer" }} />
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
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#C80505',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft:"50%",
  },
  container: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
  },
  
  heading: {
    flex: 1,
    marginRight:"500px",
    marginTop:"50px"
  },
  searchInput: {
    maxWidth: "400px",
    marginRight: "10px", 
  },
  table: {
    borderCollapse: "collapse",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
    marginTop:"10%",
    marginLeft:"5%",
  },
  headerRow: {
    backgroundColor: "#f8f9fa",
    fontWeight: "bold",
    borderRadius: "30px",
  },
  headerCell: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    color: "#333",
  },
  row: {
    transition: "background 0.3s",
    borderBottom: "1px solid #ddd",
  },
  cell: {
    padding: "10px",
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
  dialog: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    zIndex: "999",
  },
};

export default EnteteVenteArr;

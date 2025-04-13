import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Trash, Save, X, Plus , Euro  } from "lucide-react";
import { motion } from "framer-motion";

const EnteteVente = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [etatVenteArrivee, setEtatVenteArrivee] = useState([]);

  const [newItem, setNewItem] = useState({
    avion: "",
    airoport: "",
    datE_EDITION: "",
    numerO_ETAT: "",
    fL01: "",
    fL02: "",
    fL03: "",
    cC1: "",
    pnC1: "",
    noM1: "",
    noM2: "",
    cC2: "",
    pnC2: "",
    agenT_SAISIE: "",
    statut: "Not Approved",
  });

  const handleSaveTotalEncaisse = async (id, totaleEncaisse) => {
    try {
      const updatedRow = data.find((row) => row.id === id);
      updatedRow.totaleEncaisse = totaleEncaisse;
      await axios.put(`http://localhost:5000/api/EnteteVente/${id}`, updatedRow);
      setData(data.map((row) => (row.id === id ? updatedRow : row)));
    } catch (err) {
      alert("Erreur lors de la mise à jour du TotaleEncaisse!");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/EnteteVente");
        const responseArrivee = await axios.get("http://localhost:5000/api/EtatVentesarrivee");
        setEtatVenteArrivee(responseArrivee.data);
        setData(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (item) => {
    console.log("Editing item:", item);  // Check item data
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

  const validateNewItem = (item) => {
    const errors = [];
    if (typeof item.numerO_ETAT !== "string") errors.push("Numéro État doit être une chaîne.");
    if (typeof item.avion !== "string") errors.push("Avion doit être une chaîne.");
    if (typeof item.airoport !== "string") errors.push("Aéroport doit être une chaîne.");
    if (isNaN(Date.parse(item.datE_EDITION))) errors.push("Date Edition doit être une date valide.");
    if (typeof item.agenT_SAISIE !== "string") errors.push("Agent Saisie doit être une chaîne.");
    if (isNaN(Number(item.fL01))) errors.push("FL 01 doit être un nombre.");
    if (isNaN(Number(item.fL02))) errors.push("FL 02 doit être un nombre.");
    if (isNaN(Number(item.fL03))) errors.push("FL 03 doit être un nombre.");
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };

  const handleAddNew = async () => {
    if (!validateNewItem(newItem)) return;
    try {
      const response = await axios.post("http://localhost:5000/api/EnteteVente", newItem);
      setData([...data, response.data]);
      setOpenForm(false);
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

  const totalArrivee = etatVenteArrivee.reduce((acc, item) => acc + item.valeur, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Etat Des Ventes Tunisair</h2>
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

      {loading && <div style={styles.loader}>Chargement...</div>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                {["AVION", "AIROPORT", "DATE_EDITION", "NUMERO_ETAT", "PNC_1", 'TotaleValeur', 'TotaleEncaisse', "Status", "Actions", "Details"].map((header) => (
                  <th key={header} style={styles.headerCell}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id}>
                    <td style={styles.cell}>{row.avion}</td>
                    <td style={styles.cell}>{row.airoport}</td>
                    <td style={styles.cell}>{row.datE_EDITION}</td>
                    <td style={styles.cell}>{row.numerO_ETAT}</td>
                    <td style={styles.cell}>{row.pnC1}</td>
                    <td style={styles.cell}>{totalArrivee}<Euro size={15}/></td>
                    <td style={styles.cell}>
                      {isEditing === row.id ? (
                        <TextField
                          value={editedItem?.totaleEncaisse || ""}
                          onChange={(e) => setEditedItem({ ...editedItem, totaleEncaisse: e.target.value })}
                          onBlur={() => handleSaveTotalEncaisse(row.id, editedItem.totaleEncaisse)}
                          fullWidth
                        />
                      ) : (
                        parseFloat(row.totaleEncaisse).toFixed(2)
                      )}    <Euro size={15}/>

                    </td>
                    <td style={styles.cell}>
  <div
    style={{
      backgroundColor: row.statut === "Approved" ? "#D1FAE5" : "#ffcccb",
      borderRadius: "20px",
      color: row.statut === "Approved" ? "#0f543f" : "#C80505",
      padding: "10px",
      textAlign: "center",
      fontWeight: "bold",
    }}
  >
    {row.statut}
  </div>
</td>

                    <td style={styles.cell}>
                      {isEditing === row.id ? (
                        <>
                          <Save onClick={() => handleSaveEdit(editedItem)} style={{ ...styles.icon, color: "#00a3f5", cursor: "pointer" }} />
                          <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red", cursor: "pointer" }} />
                        </>
                      ) : (
                        <>
                          <Edit onClick={() => handleEdit(row)} style={{ ...styles.icon, color: "#00a3f5", cursor: "pointer" }} />
                          <Trash onClick={() => handleDelete(row.id)} style={{ ...styles.icon, color: "#e74c3c", cursor: "pointer" }} />
                        </>
                      )}
                    </td>
                    <td style={styles.cell}>
                      <Link to={`/ventePage/${row.id}`}>
                        <Button>View More ...</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={styles.noData}>Aucune donnée trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Ajouter Etat De Vente</DialogTitle>
        <DialogContent>
          {/* Form Fields */}
          <TextField label="Numéro Etat" value={newItem.numerO_ETAT} onChange={(e) => setNewItem({ ...newItem, numerO_ETAT: e.target.value })} fullWidth />
          {/* Other form fields */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">Annuler</Button>
          <Button onClick={handleAddNew} color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = {
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#C80505",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "50%",
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
    marginRight: "500px",
    marginTop: "50px",
  },
  table: {
    borderCollapse: "collapse",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    width: "90%",
    marginTop: "8%",
    marginLeft: "15%",
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
  cell: {
    padding: "10px",
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    fontWeight: "bold",
  },
};

export default EnteteVente;

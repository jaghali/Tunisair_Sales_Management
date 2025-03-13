import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import "../App.css";

const Fournisseurs = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newFournisseur, setNewFournisseur] = useState({ nom: "", adresse: "" , telephone:"" });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Fournisseurs");
      setData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des fournisseurs:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Fournisseurs/${id}`);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleEdit = (item) => {
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setEditedItem(null);
  };

  const handleSaveEdit = async () => {
    if (!editedItem) return;
    try {
      await axios.put(`http://localhost:5000/api/Fournisseurs/${editedItem.id}`, editedItem);
      fetchData();
      setEditedItem(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleChange = (e, key) => {
    setEditedItem({ ...editedItem, [key]: e.target.value });
  };

  const handleAddFournisseur = async () => {
    if (!newFournisseur.nom || !newFournisseur.adresse || !newFournisseur.telephone) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/Fournisseurs", newFournisseur);
      fetchData();
      setNewFournisseur({ nom: "", adresse: ""  , telephone:""});
      setOpenDialog(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredData = data.filter((item) =>
    item.nom.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h2 style={styles.heading}>Fournisseurs</h2>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearch}
        style={styles.searchInput}
      />
      <button onClick={() => setOpenDialog(true)} style={styles.addButton}>
        <Plus style={styles.icon} /> Ajouter Fournisseur
      </button>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>Nom</th>
            <th style={styles.headerCell}>Adresse</th>
            <th style={styles.headerCell}>Telephone</th>
            <th style={styles.headerCell}>Article</th>

          </tr>
        </thead>
        <tbody>
          {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
            <tr key={item.id} style={styles.row}>
              <td style={styles.cell}>
                {editedItem?.id === item.id ? (
                  <input type="text" value={editedItem.nom} onChange={(e) => handleChange(e, "nom")} style={styles.input} />
                ) : (
                  item.nom
                )}
              </td>
              <td style={styles.cell}>
                {editedItem?.id === item.id ? (
                  <input type="text" value={editedItem.adresse} onChange={(e) => handleChange(e, "adresse")} style={styles.input} />
                ) : (
                  item.adresse
                )}
              </td>
              <td style={styles.cell}>
                {editedItem?.id === item.id ? (
                  <input type="text" value={editedItem.telephone} onChange={(e) => handleChange(e, "telephone")} style={styles.input} />
                ) : (
                  item.telephone
                )}
              </td>
             
              <td style={styles.cell}>
                {editedItem?.id === item.id ? (
                  <>
                    <Save onClick={handleSaveEdit} style={{ ...styles.icon, color: "green" }} />
                    <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red" }} />
                  </>
                ) : (
                  <>
                    <Edit onClick={() => handleEdit(item)} style={{ ...styles.icon, color: "green" }} />
                    <Trash onClick={() => handleDelete(item.id)} style={{ ...styles.icon, color: "#e74c3c" }} />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TablePagination component="div" count={filteredData.length} page={page} onPageChange={(_, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} rowsPerPageOptions={[10, 20, 30]} />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un Fournisseur</DialogTitle>
        <DialogContent>
          <TextField label="Nom" value={newFournisseur.nom} onChange={(e) => setNewFournisseur({ ...newFournisseur, nom: e.target.value })} fullWidth margin="normal" />
          <TextField label="adresse" value={newFournisseur.adresse} onChange={(e) => setNewFournisseur({ ...newFournisseur, adresse: e.target.value })} fullWidth margin="normal" />
          <TextField label="telephone" value={newFournisseur.telephone} onChange={(e) => setNewFournisseur({ ...newFournisseur, telephone: e.target.value })} fullWidth margin="normal" />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Annuler</Button>
          <Button onClick={handleAddFournisseur} color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Fournisseurs;
const styles = { 
    heading: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#c80505",
      marginBottom: "15px",
    },
    searchInput: {
      marginBottom: "20px",
      padding: "10px",
      fontSize: "16px",
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
      borderRadius: "4px",
      border: "1px solid #ddd",
    },
    addButton: {
      backgroundColor: "#00a3f5",
      color: "white",
      padding: "10px 20px",
      fontSize: "16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginBottom: "20px",
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
    row: {
      transition: "background 0.3s",
      color:"black"
    },
    cell: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      textAlign: "left",
    },
    icon: {
      cursor: "pointer",
      marginLeft: "10px",
      transition: "transform 0.2s",
    },
    input: {
      color: "black",
      paddingLeft: "40px",
      paddingRight: "16px",
      paddingTop: "8px",
      paddingBottom: "8px",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      width: "300px",
    },
   };
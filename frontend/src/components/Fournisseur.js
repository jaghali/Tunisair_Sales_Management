import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Pencil, Trash, Save, X, Plus } from "lucide-react";
import { TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,  TextField, InputAdornment, IconButton , Button } from "@mui/material";
import "../App.css";
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';

const Fournisseurs = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
    
  
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
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h2 style={styles.heading}>Gestion des Fournisseurs</h2>

        
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", width: "100%" }}>

      <TextField
    label="Rechercher..."
    variant="standard"
    fullWidth
    style={{ ...styles.searchInput, flexGrow: 1 }} // Apply flexGrow here
    onChange={(e) => setSearchQuery(e.target.value)}
    InputLabelProps={{ style: { color: "#3D3D3D" } }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon style={{ color: "gray" }} />
        </InputAdornment>
      ),
      sx: {
        "&:before": { borderBottom: "2px solid #3D3D3D" },
        "&:hover:before": { borderBottom: "2px solid red" },
        "&:after": { borderBottom: "2px solid red" },
      },
    }}
    
  />
      <motion.button
    onClick={handleOpenDialog}
    style={styles.addButton}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Plus style={styles.icon} />
    Ajouter Fournisseur
  </motion.button>
      </div>
      
     

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
                    <Pencil onClick={() => handleEdit(item)} style={{ ...styles.icon, color: "#00a3f5" }} />
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
    
      },
      container: {
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "10px",
      },
      header: {
        display: "flex",
        justifyContent: "space-between", // Align elements side by side
        width: "100%",
        marginBottom: "20px",
      },
      heading: {
        flex: 1,
        textAlign: "left", // Align the heading to the left
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

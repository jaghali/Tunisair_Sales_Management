import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus, Search } from "lucide-react";
import { TablePagination, Button, TextField, Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const EtatVentesArriveeTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [articles, setArticles] = useState([]); 
  const [page, setPage] = useState(0);
  const [isEditing, setIsEditing] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    code: "",
    description: "",
    quantiteDotation: "",
    totEm: "",
    quantiteVendue: "",
    prixUnitaireHT: "",
    valeur: "",
    restant: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [editedItem, setEditedItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [prixArticles, setPrixArticles] = useState([]);

const fetchPrixArticles = useCallback(async ()  => {
  try {
    const response = await axios.get("http://localhost:5000/api/PrixArticles");
    setPrixArticles(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération des prix :", error);
  }
}, []);

useEffect(() => {
  fetchPrixArticles();
}, [fetchPrixArticles]);

const handleClose = () => {
  setIsAdding(false); 
};


  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/EtatVentesArrivee");
      if (response.data && response.data.length > 0) {
        setColumns(Object.keys(response.data[0]));
        setData(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, []);

  const fetchEnteteVenteArrivee = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Articles"); // Updated endpoint
      setArticles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des entetes de ventes :", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchEnteteVenteArrivee();
  }, [fetchData, fetchEnteteVenteArrivee]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        Object.keys(item).some((key) => {
          if (key === "code" || key === "description") {
            return item[key].toString().toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        })
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const handleDelete = async (code) => {
    try {
      await axios.delete(`http://localhost:5000/api/EtatVentesArrivee/${code}`);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (item) => {
    setEditedItem({ ...item });
    setIsEditing(item.code);
  };

  const handleCancelEdit = () => {
    setEditedItem(null);
    setIsEditing(null);
  };

  const handleChange = (e, key) => {
    setEditedItem({ ...editedItem, [key]: e.target.value });
  };

  const handleAddNew = async () => {
    const formattedItem = {
      code: newItem.code,  
      description: newItem.description, 
      quantiteDotation: parseInt(newItem.quantiteDotation, 10),  
      totEm: parseFloat(newItem.totEm),  
      quantiteVendue: parseInt(newItem.quantiteVendue, 10),  
      prixUnitaireHT: parseFloat(newItem.prixUnitaireHT),  
      valeur: parseFloat(newItem.valeur), 
      restant: parseInt(newItem.restant, 10),  
    };
  
    try {
      await axios.post("http://localhost:5000/api/EtatVentesArrivee", formattedItem);
      fetchData(); 
      setIsAdding(false); 
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error.response?.data || error.message);
    }
  };
  

  const handleSaveEdit = async () => {
    if (editedItem.restant > editedItem.quantiteDotation) {
      alert("Le restant ne peut pas être supérieur à la Quantité de Dotation");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/EtatVentesArrivee/${editedItem.code}`, editedItem);
      fetchData();
      setEditedItem(null);
      setIsEditing(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleNewItemChange = (e, key) => {
    const value = e.target.value;
    setNewItem((prev) => {
      const updatedItem = { ...prev, [key]: value };

      // calcul automatique de Valeur et Restant
      if (key === "quantiteVendue" || key === "prixUnitaireHT") {
        const quantiteVendue = parseFloat(updatedItem.quantiteVendue) || 0;
        const prixUnitaireHT = parseFloat(updatedItem.prixUnitaireHT) || 0;
        updatedItem.valeur = (prixUnitaireHT * quantiteVendue).toFixed(2);
      }
      if (key === "quantiteVendue" || key === "quantiteDotation") {
        const quantiteDotation = parseFloat(updatedItem.quantiteDotation) || 0;
        const quantiteVendue = parseFloat(updatedItem.quantiteVendue) || 0;
        updatedItem.restant = (quantiteDotation - quantiteVendue).toFixed(2);
      }
      return updatedItem;
    });
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <div>
      <h2 style={styles.heading}>État des Ventes Fournisseur</h2>

      {/* Search Input */}
    
        <TextField 
          variant="outlined"
          style={styles.searchBar}
          label="Rechercher"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      <Button
        variant="contained"
        color="primary"
        startIcon={<Plus />}
        onClick={() => setIsAdding(true)}
        style={styles.addButton}
      >
        Ajouter
      </Button>
      {/* Add Item Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un nouvel élément</DialogTitle></Dialog>
      {isAdding && (
        <div>
          <DialogContent>
          <Autocomplete
            options={articles} 
            getOptionLabel={(option) => option.description || ''} 
            onChange={(event, value) => {
              if (value) {
                const prix = prixArticles.find((p) => p.code === value.articleCode)?.prix || 0; 
                setNewItem({
                  ...newItem,
                  code: value.code,
                  description: value.description,
                  prixUnitaireHT: prix, // Assigne le prix récupéré
                });
              }
            }}
            
            renderInput={(params) => (
              
              <TextField
                {...params}
                label="Description"
                fullWidth
                style={styles.inputField}
              />
  
            )}
          />
          <TextField
            label="Code"
            value={newItem.code}
            onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
            fullWidth
            style={styles.inputField}
            disabled = "True"
          />
          <TextField
            label="Quantité de Dotation"
            value={newItem.quantiteDotation}
            onChange={(e) => handleNewItemChange(e, "quantiteDotation")}
            fullWidth
            style={styles.inputField}
          />
          <TextField
            label="TotEm"
            value={newItem.totEm}
            onChange={(e) => setNewItem({ ...newItem, totEm: e.target.value })}
            fullWidth
            style={styles.inputField}
          />
          <TextField
            label="Quantité Vendue"
            value={newItem.quantiteVendue}
            onChange={(e) => handleNewItemChange(e, "quantiteVendue")}
            fullWidth
            style={styles.inputField}
          />
          <TextField
            label="Prix Unitaire HT"
            value={newItem.prixUnitaireHT}
            onChange={(e) => handleNewItemChange(e, "prixUnitaireHT")}
            fullWidth
            style={styles.inputField}
          />
          <TextField
            label="Valeur"
            value={newItem.valeur}
            fullWidth
            style={styles.inputField}
            disabled
          />

          <TextField
            label="Restant"
            value={newItem.restant}
            fullWidth
            style={styles.inputField}
            disabled
          />
           </DialogContent>
          <DialogActions>
          <Button onClick={handleAddNew}>Save</Button>
          <Button onClick={handleClose} color="secondary">Annuler</Button>
          </DialogActions>
        </div>
      )}
      

      {/* Table */}
      <div>
        <table className="table">
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Code</th>
              <th style={styles.headerCell}>Description</th>
              <th style={styles.headerCell}>Quantité de Dotation</th>
              <th style={styles.headerCell}>TotEm</th>
              <th style={styles.headerCell}>Quantité Vendue</th>
              <th style={styles.headerCell}>Prix Unitaire HT</th>
              <th style={styles.headerCell}>Valeur</th>
              <th style={styles.headerCell}>Restant</th>
              <th style={styles.headerCell}>Action</th>
            </tr>
          </thead>
          <tbody>
          {paginatedData.map((item, index) => {
                        const isEditing = editedItem && editedItem.code === item.code;
                        return (
                          <tr key={index} style={styles.row}>
                            {columns.map((col) => (
                              <td key={col} style={styles.cell}>
                                {isEditing ? (
                                  <TextField
                                    value={editedItem[col]}
                                    onChange={(e) => handleChange(e, col)}
                                    style={styles.input}
                                  />
                                ) : (
                                  item[col]
                                )}
                              </td>
                            ))}
                            <td style={styles.cell}>
                              {isEditing ? (
                                <>
                                  <Save onClick={handleSaveEdit} style={{ ...styles.icon, color: "green" }} />
                                  <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red" }} />
                                </>
                              ) : (
                                <>
                                  <Edit onClick={() => handleEdit(item)} style={{ ...styles.icon, color: "#00a3f5" }} />
                                  <Trash onClick={() => handleDelete(item.code)} style={{ ...styles.icon, color: "#e74c3c" }} />
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
</tbody>

        </table>
      </div>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 5))}
      />
    </div>
  );
};

const styles = {
  heading: { textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#c80505",
    marginBottom: "15px", },
  addButton: {
    display: "flex",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "10px",
  },  
  searchBar: { 
    width: "300px", marginBottom: "50px", 
  },
  headerRow: {
    backgroundColor: "#f2f2f2",
    color: "#fff",
  },
  headerCell: {
    padding: "10px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    color:"black",
  },
  row: { transition: "background 0.3s" },
  cell: { padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left",color: "#000", },
  icon: { cursor: "pointer", marginLeft: "5px" },
  input: { width: "100%", padding: "5px", borderRadius: "4px" },
};

export default EtatVentesArriveeTable;

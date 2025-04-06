import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,Autocomplete, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const EtatOffreArriveeTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [prixArticles, setPrixArticles] = useState([]);
  const [newItem, setNewItem] = useState({
    code: "",
    description: "",
    qtDotation: "",
    totEm: "",
    quantiteOfferte: "",
    quantiteVente: "",
    restant: "", 
  });
  const [articles, setArticles] = useState([]);


  // Fonction pour récupérer les articles
  const fetchArticles = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
    }
  }, []);

  // Fonction pour récupérer le prix d'un article en fonction de la description
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

  // Fonction pour récupérer le code d'un article en fonction de la description
  const fetchCodeByDescription = useCallback(async (description) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/Articles/code/${description}`);
      if (response.data) {
        setNewItem((prevItem) => ({
          ...prevItem,
          code: response.data.code,
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du code :", error);
    }
  }, []);

  // Fonction de récupération des données des Offres
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/EtatOffresArrivee");
      if (response.data.length > 0) {
        setColumns(Object.keys(response.data[0]));
      }
      setData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchArticles(); // Récupérer les articles au démarrage
  }, [fetchData, fetchArticles]);

  const handleDelete = async (code) => {
    try {
      await axios.delete(`http://localhost:5000/api/EtatOffresArrivee/${code}`);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (item) => {
    setEditedItem(item);
  };

  const handleCancelEdit = () => {
    setEditedItem(null);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/EtatOffresArrivee/${editedItem.code}`, editedItem);
      fetchData();
      setEditedItem(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleChange = (e, key) => {
    setEditedItem({ ...editedItem, [key]: e.target.value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddChange = (e, key) => {
    const value = e.target.value;
    const updatedItem = { ...newItem, [key]: value };

    if (key === "quantiteOfferte" || key === "qtDotation" ) {
      updatedItem.restant = parseFloat(updatedItem.qtDotation || 0) - parseFloat(updatedItem.quantiteOfferte || 0);
    }

    setNewItem(updatedItem);
  };

  const handleAddItem = async () => {
    console.log("Données envoyées :", newItem);
    const formattedItem = {
      code: newItem.code, 
      description: newItem.description,
      qtDotation:parseInt(newItem.qtDotation, 10),
      quantiteOfferte:parseInt(newItem.quantiteOfferte, 10),
      restant: newItem.restant,
      totEm:parseInt(newItem.totEm, 10),
       
    };
    try {
      await axios.post("http://localhost:5000/api/EtatOffresArrivee", formattedItem);
      fetchData();
      setShowDialog(false);
      setNewItem({
        code: "",
        description: "",
        qtDotation: "",
        totEm: "",
      
        quantiteOfferte: "",
        restant: "", 
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };


  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h2 style={style.heading}>Etat des Offres Fournisseur</h2>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Plus />}
        onClick={() => setShowDialog(true)}
        style={style.addButton}
      >
        Ajouter
      </Button>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Ajouter un nouvel élément</DialogTitle>
        <DialogContent>
         <Autocomplete
                     options={articles} 
                     getOptionLabel={(option) => option.description || ''} 
                     onChange={(event, value) => {
                       if (value) { 
                         setNewItem({
                           ...newItem,
                           code: value.code,
                           description: value.description,
                         });
                       }
                     }}
                     
                     renderInput={(params) => (
                       
                       <TextField
                         {...params}
                         label="Description"
                         fullWidth
                         style={style.inputField}
                       />
           
                     )}
                   />

          {["code","qtDotation", "totEm", "quantiteOfferte"].map((col) => (
            <TextField
              key={col}
              label={col}
              value={newItem[col] || ""}
              onChange={(e) => handleAddChange(e, col)}
              fullWidth
              margin="dense"
              style={style.input}
              disabled={col === "code" || col === "description" } 
            />
          ))}
      
   
          <TextField
            label="Restant"
            value={newItem.restant || ""}
            fullWidth
            margin="dense"
            style={style.input}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddItem} color="primary">
            Enregistrer
          </Button>
          <Button onClick={() => setShowDialog(false)} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      <table className="table">
        <thead>
          <tr style={style.headerRow}>
            {columns.map((col) => (
              <th key={col} style={style.headerCell}>
                {col}
              </th>
            ))}
            <th style={style.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => {
            const isEditing = editedItem && editedItem.code === item.code;
            return (
              <tr key={index} style={style.row}>
                {columns.map((col) => (
                  <td key={col} style={style.cell}>
                    {isEditing ? (
                      <TextField
                        value={editedItem[col]}
                        onChange={(e) => handleChange(e, col)}
                        style={style.input}
                      />
                    ) : (
                      item[col]
                    )}
                  </td>
                ))}
                <td style={style.cell}>
                  {isEditing ? (
                    <>
                      <Save onClick={handleSaveEdit} style={{ ...style.icon, color: "green" }} />
                      <X onClick={handleCancelEdit} style={{ ...style.icon, color: "red" }} />
                    </>
                  ) : (
                    <>
                      <Edit onClick={() => handleEdit(item)} style={{...style.icon, color: "#00a3f5"}} />
                      <Trash onClick={() => handleDelete(item.code)} style={{...style.icon, color: "#e74c3c"}} />
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};


const style = {
  heading: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#c80505",
    marginBottom: "15px",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "10px",
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
    backgroundColor: "#f2f2f2",
    color: "#fff",
  },
  headerCell: {
    padding: "10px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    color:"black",
  },
  row: {
    borderBottom: "1px solid #ddd",
    transition: "background 0.3s",
    color:"black",
  },
  cell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  icon: {
    cursor: "pointer",
    marginLeft: "5px",
    transition: "transform 0.2s",
  },
  input: {
    width: "100%",
    padding: "5px",
  
  },
};
export default EtatOffreArriveeTable;

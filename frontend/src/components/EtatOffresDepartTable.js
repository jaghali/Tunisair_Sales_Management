import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { useParams,useNavigate } from "react-router-dom";
import { TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,Autocomplete, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { motion } from "framer-motion";

const EtatOffresDepartTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [prixArticles, setPrixArticles] = useState([]);
  const { id } = useParams();
  const [newItem, setNewItem] = useState({
    code: "",
    description: "",
    qtDotation: "",
    totEm: "",
    quantiteOfferte: "",
    restant: "", 
    enteteVenteID: id,
  });
  const [articles, setArticles] = useState([]);

  const navigate = useNavigate();

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
      const response = await axios.get("http://localhost:5000/api/EtatOffresDepart");
      const filteredData = response.data.filter(item => item.enteteVenteID === parseInt(id));
      setData(filteredData);

      console.log("Selected enteteVenteId:", id);

    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    fetchArticles(); // Récupérer les articles au démarrage
  }, [fetchData, fetchArticles]);

  const handleDelete = async (code) => {
    try {
      await axios.delete(`http://localhost:5000/api/EtatOffresDepart/${code}`);
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
      await axios.put(`http://localhost:5000/api/EtatOffresDepart/${editedItem.code}`, editedItem);
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
      enteteVenteID: newItem.enteteVenteID,
    };
    try {
      await axios.post("http://localhost:5000/api/EtatOffresDepart", formattedItem);
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
  const handleDetailClick = () => {
    navigate(`/ConfrotationOffrePage`);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
    
      <motion.button
          onClick={() => setShowDialog(true)}

          style={style.addButton}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
              <Plus  />
                        Ajouter
                      </motion.button>
      <Button onClick={handleDetailClick}>Confronter</Button>

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
            label="EnteteVenteID"
            value={newItem.enteteVenteID || ""}
            fullWidth
            margin="dense"
            style={style.input}
            disabled
          />
   
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
        <thead >
          <tr style={style.headerRow}>
          <th style={style.headerCell}>Code</th>
            <th style={style.headerCell}>Description</th>
            <th style={style.headerCell}>QtDotation</th>
            <th style={style.headerCell}>TotEm</th>
            <th style={style.headerCell}>QuantiteOfferte</th>
            <th style={style.headerCell}>Restant</th>
            <th style={style.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => {
            const isEditing = editedItem && editedItem.code === item.code;
            return (
              <tr key={index} style={style.row}>
                <td style={style.cell}>{isEditing ? (
                  <TextField
                  value={editedItem.code}
                  onChange={(e) => handleChange(e, "code")}
                  style={style.input}
                />
                ) : (
                  item.code
                )}</td>
                <td style={style.cell}>{isEditing ? (
                <TextField
                  value={editedItem.description}
                  onChange={(e) => handleChange(e, "description")}
                  style={style.input}
                />
                ) : (
                item.description
                )}</td>
                <td style={style.cell}>{isEditing ? (
                <TextField
                  value={editedItem.quantiteDotation}
                  onChange={(e) => handleChange(e, "qtDotation")}
                  style={style.input}
                />
                ) : (
                  item.quantiteDotation
                )}</td>
                <td style={style.cell}>{isEditing ? (
                <TextField
                  value={editedItem.totEm}
                  onChange={(e) => handleChange(e, "totEm")}
                  style={style.input}
                />
                ) : (
                  item.totEm
                )}</td>
                <td style={style.cell}>{isEditing ? (
                <TextField
                  value={editedItem.quantiteOfferte}
                  onChange={(e) => handleChange(e, "quantiteOfferte")}
                  style={style.input}
                />
                ) : (
                  item.quantiteOfferte
                )}</td>
                <td style={style.cell}>{isEditing ? (
                <TextField
                  value={editedItem.restant}
                  onChange={(e) => handleChange(e, "restant")}
                  style={style.input}
                />
                ) : (
                  item.restant
                )}</td>
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
 tableStyle : {
  width: "70%",
  borderCollapse: "collapse",
  marginTop: "1rem",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflow: "hidden"
},

headerRowStyle : {
  backgroundColor: "#b71c1c",
  color: "#ffffff"
},

tableHeaderStyle : {
  padding: "0.8rem",
  fontSize: "0.9rem",
  fontWeight: "600",
  borderBottom: "2px solid #880e0e",
  textAlign: "left"
},
tableCellStyle : {
  padding: "0.7rem",
  fontSize: "0.85rem",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  color: "#333"
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
export default EtatOffresDepartTable;

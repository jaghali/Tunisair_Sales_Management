import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';
import {
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { motion } from "framer-motion";

const EtatVentesDepartTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editedItem, setEditedItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [prixArticles, setPrixArticles] = useState([]);
  const { id } = useParams();
  const [newItem, setNewItem] = useState({
    code: "",
    description: "",
    qtDotation: "",
    qtCompJ: "",
    totEm: "",
    quantiteCasse: "",
    quantiteOffre: "",
    quantiteVente: "",
    prixUnitaireHT: "",
    valeur: "",
    restant: "",
    enteteVenteID: id,
  });
  const [articles, setArticles] = useState([]);

  const navigate = useNavigate();

  const fetchArticles = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
    }
  }, []);

  const fetchPrixArticles = useCallback(async () => {
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

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/EtatVentesDepart");
      const filteredData = response.data.filter(item => item.enteteVenteID === parseInt(id));
      setData(filteredData);

      console.log("Selected enteteVenteId:", id);

    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, [id]);

  useEffect(() => {
    console.log("Selected enteteVenteId:", id);
    fetchData();
    fetchArticles();
  }, [fetchData, fetchArticles]);

  const handleDelete = async (code) => {
    try {
      await axios.delete(`http://localhost:5000/api/EtatVentesDepart/${code}`);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.response?.data || error.message);
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
      await axios.put(`http://localhost:5000/api/EtatVentesDepart/${editedItem.code}`, editedItem);
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

    if (["quantiteVente", "qtDotation", "prixUnitaireHT"].includes(key)) {
      updatedItem.valeur = parseFloat(updatedItem.quantiteVente || 0) * parseFloat(updatedItem.prixUnitaireHT || 0);
      updatedItem.restant = parseFloat(updatedItem.qtDotation || 0) - parseFloat(updatedItem.quantiteVente || 0);
    }

    setNewItem(updatedItem);
  };

  const handleAddItem = async () => {
    const formattedItem = {
      code: newItem.code,
      description: newItem.description,
      prixUnitaireHT: parseFloat(newItem.prixUnitaireHT),
      qtCompJ: parseInt(newItem.qtCompJ, 10),
      qtDotation: parseInt(newItem.qtDotation, 10),
      quantiteCasse: parseInt(newItem.quantiteCasse, 10),
      quantiteOffre: parseInt(newItem.quantiteOffre, 10),
      quantiteVente: parseInt(newItem.quantiteVente, 10),
      restant: newItem.restant,
      totEm: parseInt(newItem.totEm, 10),
      valeur: parseFloat(newItem.valeur),
      enteteVenteID: newItem.enteteVenteID,
    };
    try {
      await axios.post("http://localhost:5000/api/EtatVentesDepart", formattedItem);
      fetchData();
      setShowDialog(false);
      setNewItem({
        code: "",
        description: "",
        qtDotation: "",
        qtCompJ: "",
        totEm: "",
        quantiteCasse: "",
        quantiteOffre: "",
        quantiteVente: "",
        prixUnitaireHT: "",
        valeur: "",
        restant: "",
        enteteVenteID:"",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const handleDetailClick = () => {
    navigate(`/ConfrontationPage/${id}`);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
      <div style={{ padding: "2%", maxWidth: "1000px", margin: "0 auto", marginLeft:"-10%" }}>
      <div style={style.Buttonsalligned}> 
         <motion.button
                        onClick={handleDetailClick}
                        style={style.ConfronterButton}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
              <Plus  />
                        Confronter
                      </motion.button>
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
               
               </div>
      

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Ajouter un nouvel élément</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={articles}
            getOptionLabel={(option) => option.description || ""}
            onChange={(event, value) => {
              if (value) {
                const prix = prixArticles.find((p) => p.code === value.articleCode)?.prix || 0;
                setNewItem({
                  ...newItem,
                  code: value.code,
                  description: value.description,
                  prixUnitaireHT: prix,
                });
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Description" fullWidth style={style.inputField} />
            )}
          />

          {["code", "description", "qtDotation", "qtCompJ", "totEm", "quantiteCasse", "quantiteOffre", "quantiteVente"].map((col) => (
            
            <TextField
              key={col}
              label={col}
              value={newItem[col] || ""}
              onChange={(e) => handleAddChange(e, col)}
              fullWidth
              margin="dense"
              style={style.input}
              disabled={col === "code" || col === "description"}
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
            label="Prix Unitaire HT"
            value={newItem.prixUnitaireHT}
            onChange={(e) => handleAddChange(e, "prixUnitaireHT")}
            fullWidth
            style={style.inputField}
          />
          <TextField
            label="Valeur"
            value={newItem.valeur || ""}
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
          <Button onClick={handleAddItem} color="primary">Enregistrer</Button>
          <Button onClick={() => setShowDialog(false)} color="secondary">Annuler</Button>
        </DialogActions>
      </Dialog>

      <table className="table">
        <thead>
          <tr style={style.headerRow}>
            <th style={style.headerCell}>Code</th>
            <th style={style.headerCell}>Description</th>
            <th style={style.headerCell}>QtCompJ</th>
            <th style={style.headerCell}>QtDotation</th>
            <th style={style.headerCell}>TotEm</th>
            <th style={style.headerCell}>QuantiteCasse</th>
            <th style={style.headerCell}>QuantiteOffre</th>
            <th style={style.headerCell}>QuantiteVente</th>
            <th style={style.headerCell}>PrixUnitaireHT</th>
            <th style={style.headerCell}>Valeur</th>
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
                    value={editedItem.qtCompJ}
                    onChange={(e) => handleChange(e, "qtCompJ")}
                    style={style.input}
                  />
                ) : (
                  item.qtCompJ
                )}</td>
                <td style={style.cell}>{isEditing ? (
                  <TextField
                    value={editedItem.qtDotation}
                    onChange={(e) => handleChange(e, "qtDotation")}
                    style={style.input}
                  />
                ) : (
                  item.qtDotation
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
                    value={editedItem.quantiteCasse}
                    onChange={(e) => handleChange(e, "quantiteCasse")}
                    style={style.input}
                  />
                ) : (
                  item.quantiteCasse
                )}</td>
                <td style={style.cell}>{isEditing ? (
                  <TextField
                    value={editedItem.quantiteOffre}
                    onChange={(e) => handleChange(e, "quantiteOffre")}
                    style={style.input}
                  />
                ) : (
                  item.quantiteOffre
                )}</td>
                <td style={style.cell}>{isEditing ? (
                  <TextField
                    value={editedItem.quantiteVente}
                    onChange={(e) => handleChange(e, "quantiteVente")}
                    style={style.input}
                  />
                ) : (
                  item.quantiteVente
                )}</td>
                <td style={style.cell}>{isEditing ? (
                  <TextField
                    value={editedItem.prixUnitaireHT}
                    onChange={(e) => handleChange(e, "prixUnitaireHT")}
                    style={style.input}
                  />
                ) : (
                  item.prixUnitaireHT
                )}</td>
                <td style={style.cell}>{isEditing ? (
                  <TextField
                    value={editedItem.valeur}
                    onChange={(e) => handleChange(e, "valeur")}
                    style={style.input}
                  />
                ) : (
                  item.valeur
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
                    <div>
                      <Button onClick={handleSaveEdit} style={{ color: "green", cursor: "pointer" }} ><Save /></Button>
                      <Button onClick={handleCancelEdit} style={{ color: "red", cursor: "pointer" }}><X /></Button>
                    </div>
                  ) : (
                    <div>
                      <Button onClick={() => handleEdit(item)} style={{ color: "#00a3f5", cursor: "pointer" }}><Edit /></Button>
                      <Button onClick={() => handleDelete(item.code)} style={{ color: "#e74c3c", cursor: "pointer" }} ><Trash /></Button>
                    </div>
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
  ConfronterButton : {
    padding: "10px 20px",
    backgroundColor: "#2ECC71",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "0",
},
  Buttonsalligned : {
  display: "flex",
  gap: "73%",
  alignItems: "center",
},
  heading: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    backgroundColor: "#b71c1c",
    color: "#ffffff",
    marginBottom: "15px",
  },
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
    marginLeft: "15%",
  },
  headerRow: {
    backgroundColor: "#b71c1c",
    color: "#ffffff",
  },
  headerCell: {
     padding: "0.8rem",
  fontSize: "0.9rem",
  fontWeight: "600",
  borderBottom: "2px solid #880e0e",
  textAlign: "left"
  },
  row: {
    transition: "background 0.3s",
  },
  cell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    color: "#000",
  },
  icon: {
    cursor: "pointer",
    marginLeft: "5px",
  },
  input: {
    width: "100%",
    marginBottom: "10px",
  },
  inputField: {
    marginBottom: "10px",
  }
};
export default EtatVentesDepartTable;

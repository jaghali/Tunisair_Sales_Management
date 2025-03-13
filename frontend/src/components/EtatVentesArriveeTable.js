import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus, Search } from "lucide-react";
import { TablePagination, Button, TextField, Autocomplete } from "@mui/material";

const EtatVentesArriveeTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [enteteVenteArrivee, setEnteteVenteArrivee] = useState([]); // Changed from EtatVentesArrivee to enteteVenteArrivee
  const [page, setPage] = useState(0);
  const [isEditing, setIsEditing] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      const response = await axios.get("http://localhost:5000/api/EtatVentesArrivee"); // Updated endpoint
      setEnteteVenteArrivee(response.data);
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
    if (newItem.restant > newItem.quantiteDotation) {
      alert("Le restant ne peut pas être supérieur à la Quantité de Dotation");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/EtatVentesArrivee", newItem);
      fetchData();
    
      setIsAdding(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
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

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Handle description change and automatically fill the code and prixUnitaireHT
  const handleDescriptionChange = (event, newValue) => {
    if (newValue) {
      const selectedEnteteVenteArrivee = enteteVenteArrivee.find((article) => article.description === newValue);
      if (selectedEnteteVenteArrivee) {
        setNewItem({
          ...newItem,
          description: newValue,
          code: selectedEnteteVenteArrivee.code, // Changed from article to enteteVenteArrivee
          prixUnitaireHT: selectedEnteteVenteArrivee.prixUnitaireHT, // Changed from article to enteteVenteArrivee
        });
      }
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>État des Ventes Arrivées</h2>

      {/* Search Input */}
      <div style={styles.searchInput}>
        <Search size={20} color="#3D3D3D" />
        <input
          style={styles.inputsea}
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
      {isAdding && (
        <div style={styles.formContainer}>
          <Autocomplete
            options={enteteVenteArrivee} 
            getOptionLabel={(option) => option.description || ''} 
            onChange={(event, value) => {
              if (value) {
                setNewItem({
                  ...newItem,
                  code: value.code,  // Assuming code is present in the selected option
                  description: value.description,  // Automatically set the description
                  prixUnitaireHT: value.prixUnitaireHT,  // Automatically set the price from selected enteteVenteArrivee
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
            onChange={(e) => setNewItem({ ...newItem, quantiteDotation: e.target.value })}
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
            onChange={(e) => setNewItem({ ...newItem, quantiteVendue: e.target.value })}
            fullWidth
            style={styles.inputField}
          />
          <TextField
            label="Prix Unitaire HT"
            value={newItem.prixUnitaireHT}
            onChange={(e) => setNewItem({ ...newItem, prixUnitaireHT: e.target.value })}
            fullWidth
            style={styles.inputField}
            disabled = "True"
          />
          <TextField
            label="Valeur"
            value={newItem.valeur}
            onChange={(e) => setNewItem({ ...newItem, valeur: e.target.value })}
            fullWidth
            style={styles.inputField}
          />
          <TextField
            label="Restant"
            value={newItem.restant}
            onChange={(e) => setNewItem({ ...newItem, restant: e.target.value })}
            fullWidth
            style={styles.inputField}
          />
          <Button onClick={handleAddNew}>Save</Button>
        </div>
      )}

      {/* Table */}
      <div>
        <table className="table">
          <thead>
            <tr className="header-row">
              <th className="header-cell">Code</th>
              <th className="header-cell">Description</th>
              <th className="header-cell">Quantité de Dotation</th>
              <th className="header-cell">TotEm</th>
              <th className="header-cell">Quantité Vendue</th>
              <th className="header-cell">Prix Unitaire HT</th>
              <th className="header-cell">Valeur</th>
              <th className="header-cell">Restant</th>
              <th className="header-cell">Action</th>
            </tr>
          </thead>
          <tbody>
  {paginatedData.length > 0 ? (
    paginatedData.map((row) => (
      <tr key={row.code}>
        <td className="cell">{row.code}</td>
        <td className="cell">{row.description}</td>
        <td className="cell">{row.quantiteDotation}</td>
        <td className="cell">{row.totEm}</td>
        <td className="cell">{row.quantiteVendue}</td>
        <td className="cell">{row.prixUnitaireHT}</td>
        <td className="cell">{row.valeur}</td>
        <td className="cell">{row.restant}</td>
        <td className="cell">
          {/* Edit Button */}
          <Edit onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginRight: '10px' }} />
          {/* Delete Button */}
          <Trash onClick={() => handleDelete(row.code)} style={{ cursor: 'pointer' }} />
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="9">Aucune donnée trouvée.</td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      />
    </div>
  );
};

const styles = {
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#c80505",
    marginBottom: "15px",
  },
  searchInput: {
    width: "300px",
    height: "3rem",
    marginBottom: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 0px 8px #ddd",
  },
  inputsea: {
    border: "none",
    outline: "none",
    marginLeft: "10px",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "15px",
  },
  formContainer: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    marginBottom: "15px",
    borderRadius: "8px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
  },
  inputField: {
    marginBottom: "10px",
  },
};

export default EtatVentesArriveeTable;

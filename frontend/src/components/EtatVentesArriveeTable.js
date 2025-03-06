import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { TablePagination, Button, TextField } from "@mui/material";

const EtatVentesArriveeTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [searchQuery, setSearchQuery] = useState("");  // Search query state

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/EtatVentesArrivee");
      if (response.data && response.data.length > 0) {
        setColumns(Object.keys(response.data[0]));
        setData(response.data);
        setFilteredData(response.data);  // Initially, all data is visible
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(data);  // If no search query, show all data
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

  const handleEdit = (item) => setEditedItem(item);
  const handleCancelEdit = () => setEditedItem(null);

  const handleSaveEdit = async () => {
    if (!editedItem?.code) return;
    try {
      await axios.put(`http://localhost:5000/api/EtatVentesArrivee/${editedItem.code}`, editedItem);
      fetchData();
      setEditedItem(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleChange = (e, key) => setEditedItem({ ...editedItem, [key]: e.target.value });
  const handleChangeNewItem = (e, key) => setNewItem({ ...newItem, [key]: e.target.value });

  const handleAddNew = async () => {
    if (Object.keys(newItem).length !== columns.length || Object.values(newItem).some((val) => val === "")) {
      console.error("Tous les champs sont requis");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/EtatVentesArrivee", newItem);
      fetchData();
      setNewItem({});
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h2 style={styles.heading}>Etat des Ventes Arrivées</h2>

      {/* Search Input */}
      <TextField
        label="Rechercher par Code ou Description"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />

      <Button variant="contained" startIcon={<Plus />} onClick={() => setNewItem(columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {}))} style={styles.addButton}>
        Ajouter
      </Button>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            {columns.map((col) => (
              <th key={col} style={styles.headerCell}>
                {col}
              </th>
            ))}
            <th style={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => {
            const isEditing = editedItem && editedItem.code === item.code;
            return (
              <tr key={item.code} style={styles.row}>
                {columns.map((col) => (
                  <td key={col} style={styles.cell}>
                    {isEditing ? (
                      <TextField type="text" value={editedItem[col]} onChange={(e) => handleChange(e, col)} style={styles.input} />
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

          {/* New row for adding a new item */}
          {newItem && Object.keys(newItem).length > 0 && (
            <tr style={styles.row}>
              {columns.map((col) => (
                <td key={col} style={styles.cell}>
                  <TextField
                    type="text"
                    value={newItem[col] || ""}
                    onChange={(e) => handleChangeNewItem(e, col)}
                    style={styles.input}
                    placeholder={`Enter ${col}`}
                  />
                </td>
              ))}
              <td style={styles.cell}>
                <Save onClick={handleAddNew} style={{ ...styles.icon, color: "green" }} />
                <X onClick={() => setNewItem({})} style={{ ...styles.icon, color: "red" }} />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 30]}
      />
    </div>
  );
};

// Styles using JavaScript object
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
    marginBottom: "20px",
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
    marginBottom: "15px",
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
    width: "100%",
    padding: "5px",
    borderRadius: "4px",
  },
};

export default EtatVentesArriveeTable;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { TablePagination, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const EtatVentesArriveeTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [openDialog, setOpenDialog] = useState(false); // State to manage the dialog open/close

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/AgentSaisie/EtatVentesArrivee");
      if (response.data.length > 0) {
        setColumns(Object.keys(response.data[0]));  // Setting column headers dynamically
      }
      setData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (code) => {
    if (!code) {
      console.error("Code invalide pour la suppression");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/AgentSaisie/EtatVentesArrivee/${code}`);
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
    if (!editedItem) return;

    try {
      await axios.put(`http://localhost:5000/api/AgentSaisie/EtatVentesArrivee/${editedItem.code}`, editedItem);
      fetchData();
      setEditedItem(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleChange = (e, key) => {
    setEditedItem({ ...editedItem, [key]: e.target.value });
  };

  const handleChangeNewItem = (e, key) => {
    setNewItem({ ...newItem, [key]: e.target.value });
  };

  const handleAddNew = async () => {
    if (!newItem || Object.keys(newItem).length === 0) return;
    try {
      await axios.post("http://localhost:5000/api/AgentSaisie/EtatVentesArrivee", newItem);
      fetchData();
      setOpenDialog(false); // Close the dialog after submitting
      setNewItem({});
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h2 style={styles.heading}>Etat des Ventes Arrivées</h2>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Plus />}
        onClick={() => setOpenDialog(true)} // Open the dialog when the "Ajouter" button is clicked
        style={styles.addButton}
      >
        Ajouter
      </Button>

      {/* Dialog for adding a new item */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ajouter un nouvel élément</DialogTitle>
        <DialogContent>
          {columns.map((col) => (
            <TextField
              key={col}
              label={col}
              fullWidth
              margin="normal"
              value={newItem[col] || ""}
              onChange={(e) => handleChangeNewItem(e, col)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddNew} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

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
          {paginatedData.map((item, index) => {
            const isEditing = editedItem && editedItem.code === item.code;
            return (
              <tr key={index} style={styles.row}>
                {columns.map((col) => (
                  <td key={col} style={styles.cell}>
                    {isEditing ? (
                      <TextField
                        type="text"
                        value={editedItem[col]}
                        onChange={(e) => handleChange(e, col)}
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

      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 30]}
      />
    </div>
  );
};

// CSS Styles
const styles = {
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#c80505",
    marginBottom: "15px",
  },
  addButton: {
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  headerRow: {
    backgroundColor: "#f8f9fa",
  },
  headerCell: {
    padding: "10px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
  },
  row: {
    borderBottom: "1px solid #ddd",
  },
  cell: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  icon: {
    cursor: "pointer",
    margin: "0 5px",
  },
};

export default EtatVentesArriveeTable;

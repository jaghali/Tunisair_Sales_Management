import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, PlusCircle } from "lucide-react";
import { TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import "../App.css";

const Articles = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [openDialog, setOpenDialog] = useState(false); // State to control the add article dialog
  const [newArticle, setNewArticle] = useState({ code: "", description: "", price: "" }); // Form data for adding a new article

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Articles");
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
  }, [fetchData]);

  const handleDelete = async (code) => {
    if (!code) {
      console.error("Code invalide pour la suppression");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/Articles/${code}`);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (item) => {
    setEditedItem({ ...item }); // Make a copy of the item being edited
  };

  const handleCancelEdit = () => {
    setEditedItem(null); // Cancel editing
  };

  const handleSaveEdit = async () => {
    if (!editedItem) return;

    try {
      await axios.put(`http://localhost:5000/api/Articles/${editedItem.code}`, editedItem);
      fetchData();
      setEditedItem(null); // Close form after saving
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Update search term in lowercase
  };

  const handleOpenDialog = () => {
    setOpenDialog(true); // Open dialog to add article
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog
  };

  const handleAddArticle = async () => {
    // Validate that all fields are filled out
    if (!newArticle.code || !newArticle.description) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      // Send POST request to add new article
      await axios.post("http://localhost:5000/api/Articles", newArticle);
      fetchData(); // Refetch data
      setNewArticle({ code: "", description: "", price: "" }); // Reset form
      setOpenDialog(false); // Close dialog
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article:", error);
    }
  };

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    return columns.some((col) =>
      item[col] && item[col].toString().toLowerCase().includes(searchTerm)
    );
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h2 style={styles.heading}>Articles</h2>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearch}
        style={styles.searchInput}
      />
      <button onClick={handleOpenDialog} style={styles.addButton}>
        <PlusCircle style={styles.icon} />
        Ajouter Article
      </button>

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
                      <input
                        type="text"
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

      <TablePagination
        component="div"
        count={filteredData.length} // Use filtered data length
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 30]}
      />

      {/* Dialog for adding article */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un Article</DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            name="code"
            value={newArticle.code}
            onChange={(e) => setNewArticle({ ...newArticle, code: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={newArticle.description}
            onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Annuler</Button>
          <Button onClick={handleAddArticle} color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>
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
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
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

export default Articles;

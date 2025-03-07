import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus, Search } from "lucide-react";
import { TablePagination, TextField,Autocomplete } from "@mui/material";

const EtatOffreArriveeTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(0);
  const [articles, setArticles] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

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

  const fetchArticles = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
    }
  }, []);

   useEffect(() => {
     fetchData();
     fetchArticles();
   }, [fetchData, fetchArticles]);


  // Filter data based on search query (code or description)
  const filteredData = data.filter((item) => {
    const codeMatch = item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const descriptionMatch = item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return codeMatch || descriptionMatch;
  });

  const handleDelete = async (code) => {
    if (!code) {
      console.error("Code invalide pour la suppression");
      return;
    }
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
    if (!editedItem) return;

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

  const handleAdd = () => {
    setNewItem({});
    setIsAdding(true);
  };

  const handleChangeNew = (e, key) => {
    setNewItem({ ...newItem, [key]: e.target.value });
  };

  const handleSaveNew = async () => {
    try {
      await axios.post("http://localhost:5000/api/EtatOffresArrivee", newItem);
      fetchData();
      setNewItem(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const handleCancelAdd = () => {
    setNewItem(null);
    setIsAdding(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h2 style={styles.heading}>Etat des Offres Arrivée</h2>
      
      {/* Search Input */}
      <TextField 
             startIcon={<Search/>}
             label="Rechercher"
             variant="outlined"
             fullWidth
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             style={styles.searchBar}
           />

      <button onClick={handleAdd} style={styles.addButton}>
        <Plus size={20} style={{ marginRight: "5px" }} />
        Ajouter
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
          {isAdding && (
            <tr style={styles.row}>
              {columns.map((col) => (
                <td key={col} style={styles.cell}>
                  {col === "description" ? (
                      <Autocomplete
                      options={articles}
                      getOptionLabel={(option) => option.description}
                      value={articles.find((article) => article.description === newItem[col]) || null}
                      onChange={(event, newValue) => {
                        setNewItem({ ...newItem, [col]: newValue ? newValue.description : "" });
                      }}
                      renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
                    />
                   ) : (
                  <TextField
                    value={newItem[col] || ""}
                    onChange={(e) => handleChangeNew(e, col)}
                    style={styles.input}
                  />
                 )}
                </td>
              ))}
              <td style={styles.cell}>
                <Save onClick={handleSaveNew} style={{ ...styles.icon, color: "green" }} />
                <X onClick={handleCancelAdd} style={{ ...styles.icon, color: "red" }} />
              </td>
            </tr>
          )}
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
  searchBar: {
    width: "300px",
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
    width: "100%",
    padding: "5px",
    borderRadius: "4px",
  },
};

export default EtatOffreArriveeTable;

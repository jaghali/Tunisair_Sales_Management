import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { TablePagination, Button, TextField,Autocomplete } from "@mui/material";
import "../App.css";

const EtatVentesDepartTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [isAdding, setIsAdding] = useState(false); // Track if adding mode is active
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/EtatVentesDepart");
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

  const handleDelete = async (code) => {
    try {
      await axios.delete(`http://localhost:5000/api/EtatVentesDepart/${code}`);
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
    setNewItem({ ...newItem, [key]: e.target.value });
  };

  const handleAddItem = async () => {
    try {
      await axios.post("http://localhost:5000/api/EtatVentesDepart", newItem);
      fetchData();
      setIsAdding(false);
      setNewItem({});
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  // Filter data based on the search query (search by code and description)
  const filteredData = data.filter((item) => {
    return (
      item.code.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h2 style={style.heading}>Etat des Ventes Départ</h2>

      {/* Search Bar */}
      <TextField
        label="Rechercher "
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={style.searchBar}
      />

      <Button
        variant="contained"
        color="primary"
        startIcon={<Plus />}
        onClick={() => setIsAdding(true)} // Toggle the add form visibility
        style={style.addButton}
      >
        Ajouter
      </Button>

      <table style={style.table}>
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
          {isAdding && (
            <tr style={style.row}>
              {columns.map((col) => (
                <td key={col} style={style.cell}>
                  {col === "description" ? (
                <Autocomplete
                          options={articles}
                         getOptionLabel={(option) => option.description}
                         value={articles.find((article) => article.description === newItem[col]) || null}                                          onChange={(event, newValue) => {
                          setNewItem({ ...newItem, [col]: newValue ? newValue.description : "" });
                        }}
                        renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
                    />
                    ) : (
                  <TextField
                    value={newItem[col] || ""}
                    onChange={(e) => handleAddChange(e, col)}
                    fullWidth
                    margin="dense"
                    style={style.input}
                  />)}
                </td>
              ))}
              <td style={style.cell}>
                <Save onClick={handleAddItem} style={{ ...style.icon, color: "green" }} />
                <X onClick={() => setIsAdding(false)} style={{ ...style.icon, color: "red" }} />
              </td>
            </tr>
          )}

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
                      <Edit onClick={() => handleEdit(item)} style={{ ...style.icon, color: "#00a3f5" }} />
                      <Trash onClick={() => handleDelete(item.code)} style={{ ...style.icon, color: "#e74c3c" }} />
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
const style = {
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
    borderBottom: "1px solid #ddd",
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
  searchBar: {
    width: "300px",
    marginBottom: "20px",  },
};

export default EtatVentesDepartTable;

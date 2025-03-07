import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus,Search } from "lucide-react";
import { TablePagination, Button, TextField, Autocomplete } from "@mui/material";

const EtatVentesArriveeTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newItem, setNewItem] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [editedItem, setEditedItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Ajouter un état pour afficher le formulaire d'ajout

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
      await axios.delete("http://localhost:5000/api/EtatVentesArrivee/${code}");
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
      await axios.put(`http://localhost:5000/api/EtatVentesArrivee/${editedItem.code}`, editedItem);
      fetchData();
      setEditedItem(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleChange = (e, key) => setEditedItem({ ...editedItem, [key]: e.target.value });
  //const handleChangeNewItem = (e, key) => setNewItem({ ...newItem, [key]: e.target.value });

  const handleAddNew = async () => {
    try {
      await axios.post("http://localhost:5000/api/EtatVentesArrivee", newItem);
      fetchData();
      setNewItem({});
      setIsAdding(false); // Fermer le formulaire après ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <div>
      <h2 style={styles.heading}>État des Ventes Arrivées</h2>
      {/* Search Input */}
     <div style={styles.searchInput}>
     <Search size={20} color="#3D3D3D"    
     />

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
            onClick={() => setIsAdding(true)} // Toggle the add form visibility
            style={styles.addButton}
        >
        Ajouter
        </Button>
        <div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                {columns.map((col) => (
                  <th key={col} style={styles.headerCell}>{col}</th>
                ))}
                <th style={styles.headerCell}>Actions</th>
              </tr>
            </thead>
            <tbody>  
            {isAdding && (   
              <tr style={styles.row}>
                {columns.map((col) => (
                  <td key={col}  style={styles.cell}>
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
                        onChange={(e) => setNewItem({ ...newItem, [col]: e.target.value })}
                      />
                    )}
                  </td>
                ))}
                <td style={styles.cell}>
                    <Save onClick={handleAddNew} style={{ ...styles.icon, color: "green" }} />
                    <X onClick={() => setIsAdding(false)} style={{ ...styles.icon, color: "red" }} />
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
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
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
    height :"3rem",
    marginBottom: "20px",
    backgroundColor:"white",
    borderRadius:"10px",
    padding : "0 15px",
    display:"flex",
    alignItems:"center",
    boxShadow:"0px 0px 8px #ddd"
    

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
  inputsea:{
    border:"none",
    outline : "none",
    marginLeft : "10px"
  },
 
};
export default EtatVentesArriveeTable;

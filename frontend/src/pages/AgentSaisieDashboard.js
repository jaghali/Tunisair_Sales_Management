import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { TablePagination } from "@mui/material";
import { Edit, Trash } from "lucide-react"; 
import "../App.css";

const AgentSaisieDashboard = () => {
  const [selectedTable, setSelectedTable] = useState("EtatVentesArrivee");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch data from the selected table
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/AgentSaisie/${selectedTable}`);
      if (response.data.length > 0) {
        setColumns(Object.keys(response.data[0]));
      }
      setData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, [selectedTable]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (code) => {
    if (!code) {
      console.error("Code invalide pour la suppression");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/AgentSaisie/${selectedTable}/${code}`);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code) {
      alert("Le champ Code est requis !");
      return;
    }

    try {
      if (isEditing && editId) {
        await axios.put(
          `http://localhost:5000/api/AgentSaisie/${selectedTable}/${editId}`,
          formData, 
          { headers: { "Content-Type": "application/json" } }
        );
        fetchData(); 
      } else {
        await axios.post(
          `http://localhost:5000/api/AgentSaisie/${selectedTable}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        fetchData(); 
      }

      setFormData({});
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.code);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({});
    setShowForm(true);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Slice data to display on the current page
  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Styling constants
  const containerStyle = {
    padding: "5%",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333",
  };

  const buttonStyle = {
    backgroundColor: "Green",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft:"5%",
    border: "none",
  };

  const selectStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    borderRadius: "5px",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    marginBottom: "10px",
    borderRadius: "5px",
    width: "100%",
    border: "1px solid #ccc",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const tableHeaderStyle = {
    backgroundColor: "#c80505",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  };

  const tableCellStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Tableau de bord - Agent de saisie</h1>

      <select
        onChange={(e) => setSelectedTable(e.target.value)}
        value={selectedTable}
        style={selectStyle}
      >
        <option value="EtatVentesArrivee">Etat de ventes arrivée</option>
        <option value="EtatVentesDepart">Etat de ventes départ</option>
        <option value="EtatOffresArrivee">Etat d'offres arrivée</option>
        <option value="EtatOffresDepart">Etat d'offres départ</option>
      </select>

      <button style={buttonStyle} onClick={handleAddNew}>
        Ajouter un nouvel élément
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ padding: "20px", backgroundColor: "none" }}>
          <h3>{isEditing ? "Modifier l'élément" : "Ajouter un élément"}</h3>
          {columns.map((col) => (
            <input
              key={col}
              name={col}
              placeholder={col}
              value={formData[col] || ""}
              onChange={handleInputChange}
              style={inputStyle}
            />
          ))}
          <button type="submit" style={buttonStyle}>
            {isEditing ? "Modifier" : "Ajouter"}
          </button>
          <button type="button" onClick={() => setShowForm(false)} style={buttonStyle}>
            Annuler
          </button>
        </form>
      )}

      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        {data.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} style={tableHeaderStyle}>
                    {col}
                  </th>
                ))}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => {
                const code = item.code;

                return (
                  <tr key={code || index}>
                    {columns.map((col) => (
                      <td key={col} style={tableCellStyle}>{item[col]}</td>
                    ))}
                    <td style={tableCellStyle}>
                      <Edit
                        onClick={() => handleEdit(item)}
                        style={{ cursor: "pointer", color: "#00a3f5", marginRight: "10px" }}
                      />
                      {code && (
                        <Trash
                          onClick={() => handleDelete(code)}
                          style={{ cursor: "pointer", color: "#e74c3c" }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Aucune donnée à afficher.</p>
        )}
      </div>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 30]}
        style={{ marginTop: "20px", color: "#c80505" }}
      />
    </div>
  );
};

export default AgentSaisieDashboard;

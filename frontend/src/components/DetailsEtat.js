import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { motion } from 'framer-motion';
import { useCurrency } from "../pages/CurrencyContext";

const DetailsEtat = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const navigate = useNavigate();

  const { currency } = useCurrency();

  function getCurrencySymbol(code) {
    switch (code) {
      case "TND":
        return "DT";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return code;
    }
  }

  const symbol = getCurrencySymbol(currency);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/EnteteVente/${id}`);
        setData(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleEdit = (item) => {
    setIsEditing(item.id);
    setEditedItem({ ...item });
  };

  const handleSaveEdit = async (newData) => {
    try {
      await axios.put(`http://localhost:5000/api/EnteteVente/${newData.id}`, newData);
      setData(newData);
      setIsEditing(null);
      setEditedItem(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour !");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedItem(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/EnteteVente/${id}`);
        navigate('/');
      } catch (err) {
        alert("Erreur lors de la suppression !");
      }
    }
  };

  return (
    <div style={styles.container}>
      {loading && <div style={styles.loader}>Chargement...</div>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && data && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <tbody>
              {[
                ['ID', 'id'],
                ['FOURNISSEUR', 'fournisseur'],
                ['AIROPORT', 'airoport'],
                ['DATE_EDITION', 'datE_EDITION'],
                ['NUMERO_ETAT', 'numerO_ETAT'],
                ['fL01', 'fL01'],
                ['fL02', 'fL02'],
                ['fL03', 'fL03'],
                ['cC1', 'cC1'],
                ['pnC1', 'pnC1'],
                ['noM1', 'noM1'],
                ['noM2', 'noM2'],
                ['cC2', 'cC2'],
                ['pnC2', 'pnC2'],
                ['totaleEncaisse', 'totaleEncaisse'],
              ].map(([label, field]) => (
                <tr key={field}>
                  <td style={styles.headerCell}>{label}</td>
                  <td style={styles.cell}>
                    {isEditing === data.id ? (
                      <input
                        type="text"
                        value={editedItem[field]}
                        onChange={(e) =>
                          setEditedItem({ ...editedItem, [field]: e.target.value })
                        }
                      />
                    ) : field === 'totaleEncaisse' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {data[field]} {symbol}
                      </div>
                    ) : (
                      data[field]
                    )}
                  </td>
                </tr>
              ))}

              <tr>
                <td style={styles.headerCell}>Status</td>
                <td style={styles.cell}>
                  <div
                    style={{
                      backgroundColor: data.statut === "Approved" ? "#D1FAE5" : "#ffcccb",
                      borderRadius: "20px",
                      color: data.statut === "Approved" ? "#0f543f" : "#C80505",
                      padding: "10px",
                      alignItems: "center",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {data.statut}
                  </div>
                </td>
              </tr>

              <tr>
                <td style={styles.headerCell}>Actions</td>
                <td style={styles.cell}>
                  {isEditing === data.id ? (
                    <>
                      <Save onClick={() => handleSaveEdit(editedItem)} style={{ ...styles.icon, color: "#00a3f5", cursor: "pointer" }} />
                      <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red", cursor: "pointer" }} />
                    </>
                  ) : (
                    <>
                      <Edit onClick={() => handleEdit(data)} style={{ ...styles.icon, color: "#00a3f5", cursor: "pointer" }} />
                      <Trash onClick={() => handleDelete(data.id)} style={{ ...styles.icon, color: "#e74c3c", cursor: "pointer" }} />
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  cell: {
    padding: "10px",
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#C80505',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: "50%",
  },
  container: {
    padding: "10px",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
  },
  heading: {
    flex: 1,
    marginRight: "500px",
    marginTop: "50px"
  },
  searchInput: {
    maxWidth: "400px",
    marginRight: "10px",
  },
  table: {
    borderCollapse: "collapse",
    borderRadius: "10px",
    backgroundColor: "#fff",
    width: "100%",
    marginTop: "4%",
    marginBottom: "5%",
    marginLeft: "-5%",
  },
  headerRow: {
    backgroundColor: "#f8f9fa",
    fontWeight: "bold",
    borderRadius: "30px",
  },
  headerCell: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    color: "#333",
    fontWeight: "bold",
    width: "200px"
  },
  row: {
    transition: "background 0.3s",
    borderBottom: "1px solid #ddd",
  },
  dialog: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    zIndex: "999",
  },
};

export default DetailsEtat;

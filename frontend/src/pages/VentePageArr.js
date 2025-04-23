import React, { useState, useEffect } from "react";
import axios from "axios";
import EtatVentesArriveeTable from "../components/EtatVentesArriveeTable";
import { Edit, Trash, Plus, Save, X, Users, ShoppingBag, Undo2 } from "lucide-react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Button, TextField, Autocomplete, Snackbar } from "@mui/material";
import { motion } from "framer-motion";
import DetailsEtat from "../components/DetailsEtat";
import { useNavigate, useParams } from "react-router-dom";

const VentePageArr = () => {
  const [venteDetails, setVenteDetails] = useState([]);
  const [venteEtatArrivee, setVenteEtatArrivee] = useState([]);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ pnc: "", matricule: "" });
  const [editedItem, setEditedItem] = useState(null);
  const [pncs, setPncs] = useState([]);
  const [entete, setEntete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [response, etatArriveeResponse, pncResponse, enteteResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/ListeEquipageV"),
          axios.get("http://localhost:5000/api/EtatVentesArrivee"),
          axios.get("http://localhost:5000/api/pn"),
          axios.get("http://localhost:5000/api/EnteteVente"),
        ]);
        setVenteDetails(response.data);
        setVenteEtatArrivee(etatArriveeResponse.data);
        setPncs(pncResponse.data);
        setEntete(enteteResponse.data[0]); // Assuming the first entete is relevant
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddNew = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post("http://localhost:5000/api/ListeEquipageV", newItem);
      setVenteDetails([...venteDetails, response.data]);
      setIsAdding(false);
      setNewItem({ pnc: "", matricule: "" });
    } catch (error) {
      setError("Erreur lors de l'ajout.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => setEditedItem(item);

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/ListeEquipageV/${editedItem.matricule}`, editedItem);
      setVenteDetails(venteDetails.map(item => item.matricule === editedItem.matricule ? editedItem : item));
      setEditedItem(null);
    } catch (error) {
      setError("Erreur lors de la modification.");
    }
  };

  const handleDelete = async (matricule) => {
    try {
      await axios.delete(`http://localhost:5000/api/ListeEquipageV/${matricule}`);
      setVenteDetails(venteDetails.filter(item => item.matricule !== matricule));
    } catch (error) {
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div style={{ padding: "2%", maxWidth: "1000px", margin: "0 auto" }}>
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        centered
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          "& .MuiTabs-indicator": { backgroundColor: "#B71C1C" },
          "& .MuiTab-root": { transition: "color 0.3s ease-in-out" },
          "& .Mui-selected": { color: "#B71C1C !important" },
        }}
      >
        <Tab label="Liste Equipage" icon={<motion.div whileHover={{ scale: 1.2 }}><Users /></motion.div>} />
        <Tab label="État Ventes Fournisseur" icon={<motion.div whileHover={{ scale: 1.2 }}><ShoppingBag /></motion.div>} />
      </Tabs>

      <Undo2 style={{ cursor: "pointer", color: "#B71C1C" }} size={28} onClick={() => navigate(-1)} />

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {tabValue === 0 && (
            <div>
              <DetailsEtat />
              <Button variant="contained" color="primary" startIcon={<Plus />} onClick={() => setIsAdding(true)}>
                Ajouter
              </Button>
              <table style={tableStyle}>
                <thead>
                  <tr >
                    <th style={tableHeaderStyle}>PNC</th>
                    <th style={tableHeaderStyle}>Matricule</th>
                    <th style={tableHeaderStyle}>EnteteVenteID</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isAdding && (
                    <tr>
                      <td style={tableCellStyle}>
                        <Autocomplete
                          options={pncs}
                          getOptionLabel={(option) => option?.nom || ""}
                          onChange={(event, newValue) => {
                            setNewItem({
                              pnc: newValue?.nom || "",
                              matricule: newValue?.matricule || "",
                              enteteVenteID: parseInt(id),
                            });
                          }}
                          renderInput={(params) => <TextField {...params} label="PNC" />}
                        />
                      </td>
                      <td style={tableCellStyle}>
                        <TextField value={newItem.matricule} disabled />
                      </td>
                      <td style={tableCellStyle}>{id}</td>
                      <td style={tableCellStyle}>
                        <Save onClick={handleAddNew} style={{ color: "green", cursor: "pointer" }} disabled={isSaving} />
                        <X onClick={() => setIsAdding(false)} style={{ color: "red", cursor: "pointer" }} />
                      </td>
                    </tr>
                  )}
                  {venteDetails.map((item, index) => {
                    const isEditing = editedItem && editedItem.matricule === item.matricule;

                    return (
                      <tr key={index}>
                        <td style={tableCellStyle}>
                          {isEditing ? (
                            <TextField
                              value={editedItem.pnc}
                              onChange={(e) => setEditedItem({ ...editedItem, pnc: e.target.value })}
                            />
                          ) : (
                            item.pnc
                          )}
                        </td>
                        <td style={tableCellStyle}>
                          {isEditing ? (
                            <TextField
                              value={editedItem.matricule}
                              onChange={(e) => setEditedItem({ ...editedItem, matricule: e.target.value })}
                            />
                          ) : (
                            item.matricule
                          )}
                        </td>
                        <td style={tableCellStyle}>{item.enteteVenteID}</td>
                        <td style={tableCellStyle}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            color: "#fff",
                            backgroundColor:
                              item.status === "PNC"
                                ? "#e74c3c"
                                : item.status === "PNC VENDEUR" || (entete && item.matricule === entete.pnC1)
                                ? "#2ecc71"
                                : "#e74c3c"
                          }}>
                            {(item.status === "PNC VENDEUR" || (entete && item.matricule === entete.pnC1))
                              ? "PNC VENDEUR"
                              : item.status || "PNC"}
                          </span>
                        </td>
                        <td style={tableCellStyle}>
                          {isEditing ? (
                            <>
                              <Save onClick={handleSaveEdit} style={{ color: "green", cursor: "pointer" }} />
                              <X onClick={() => setEditedItem(null)} style={{ color: "red", cursor: "pointer" }} />
                            </>
                          ) : (
                            <>
                              <Edit onClick={() => handleEdit(item)} style={{ color: "#00a3f5", cursor: "pointer" }} />
                              <Trash onClick={() => handleDelete(item.matricule)} style={{ color: "#e74c3c", cursor: "pointer" }} />
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tabValue === 1 && venteEtatArrivee && venteEtatArrivee.length > 0 && (
            <EtatVentesArriveeTable data={venteEtatArrivee} />
          )}
        </>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        message={error}
        onClose={() => setOpenSnackbar(false)}
      />
    </div>
  );
};

const tableStyle = {
  width: "70%",
  borderCollapse: "collapse",
  marginTop: "1rem",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflow: "hidden"
};

const tableHeaderStyle = {
  padding: "0.8rem",
  fontSize: "0.9rem",
  fontWeight: "600",
  borderBottom: "2px solid #880e0e",
  textAlign: "left"
};

const tableCellStyle = {
  padding: "0.7rem",
  fontSize: "0.85rem",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  color: "#333"
};

export default VentePageArr;

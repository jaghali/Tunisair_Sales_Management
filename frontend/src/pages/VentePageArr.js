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
import { useToast } from "./toast";

const VentePageArr = () => {
  const [venteDetails, setVenteDetails] = useState([]);
  const [venteEtatArrivee, setVenteEtatArrivee] = useState([]);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ pnc: "", matricule: "" });
  const [editedItem, setEditedItem] = useState(null);
  const [pncs, setPncs] = useState([]);
  const [enteteVente, setEntete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showToast } = useToast();

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
        const filteredEquipage = response.data.filter(item => item.enteteVenteID === parseInt(id));

        setVenteDetails(filteredEquipage);
        setVenteEtatArrivee(etatArriveeResponse.data);
        setPncs(pncResponse.data);
        setEntete(enteteResponse.data[0]); // Assuming the first entete is relevant
      } catch (err) {
        showToast("Erreur lors du chargement des données.");
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
      showToast("Erreur lors de l'ajout.");
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
      showToast("Erreur lors de la modification.");
    }
  };

  const handleDelete = async (matricule, id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ListeEquipageV/${matricule}/${id}`);
      
      //Mettre à jour la liste sans l'équipage supprimé
      setVenteDetails(prev =>
        prev.filter(item =>
          !(item.matricule === matricule && item.enteteVenteID === parseInt(id))
        )
      );
    } catch (error) {
      showToast("Erreur lors de la suppression.");
    }
  };
  

  return (
    <motion.div animate={{ marginLeft: sidebarOpen ? 250 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: sidebarOpen ? 0 : -300 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100%",
              width: "250px",
              backgroundColor: "#fff",
              color: "#fff",
              padding: "1rem",
              zIndex: 9999,
              boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
              overflowY: "auto", 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
    
            }}
          >        
          <DetailsEtat />
    
          </motion.div>

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


      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {tabValue === 0 && (
        <div style={{marginTop:"3%"}}>
              <div style={Buttonsalligned}> 
                        <motion.button
                     onClick={() => setSidebarOpen(!sidebarOpen)}
                     style={ShowButton}
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     transition={{ type: "spring", stiffness: 300 }}
                   >
                     {sidebarOpen ? "Hide Details" : "Show Details"}
                   </motion.button>
                       <motion.button
                               onClick={() => setIsAdding(true)}
                               style={addButton}
                               whileHover={{ scale: 1.1 }}
                               whileTap={{ scale: 0.9 }}
                               transition={{ type: "spring", stiffness: 300 }}
                             >
                     <Plus  />
                               Ajouter
                             </motion.button>
                      </div>
                      <table style={tableStyle}>
                          <thead>
                            <tr style={headerRowStyle}>
                              <th style={tableHeaderStyle}>PNC</th>
                              <th style={tableHeaderStyle}>Matricule</th>
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
                                  <Save onClick={handleAddNew} style={{ color: "green", cursor: "pointer" }} />
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
                                  <td style={tableCellStyle}>
                                  <span style={{
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "0.75rem",
                color: "#fff",
                backgroundColor:
                  item.status === "PNC"
                    ? "#e74c3c"
                    : item.status === "PNC VENDEUR" || (enteteVente && item.matricule === enteteVente.pnC1)
                    ? "#2ecc71"
                    : "#e74c3c"
              }}>
                {(item.status === "PNC VENDEUR" || (enteteVente && item.matricule === enteteVente.pnC1))
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
            </motion.div>
    
  );
};
const Buttonsalligned = {
  display: "flex",
  gap: "19rem", // space between buttons
  alignItems: "center", // vertical alignment
};
  const addButton = {
    padding: "10px 20px",
    backgroundColor: "#C80505",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
  
    marginLeft: "15%",
};
 const ShowButton = {
    padding: "10px 20px",
    backgroundColor: "#2ECC71",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "15%",
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
const headerRowStyle = {
  backgroundColor: "#b71c1c",
  color: "#ffffff"
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

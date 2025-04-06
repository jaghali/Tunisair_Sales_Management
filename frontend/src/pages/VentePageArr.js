import React, { useState, useEffect } from "react";
import axios from "axios";
import EtatVentesArriveeTable from "../components/EtatVentesArriveeTable";
import { Edit, Trash, Plus, Save, X , Users, ShoppingBag  } from "lucide-react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Button, TextField, Autocomplete } from "@mui/material";
import { motion } from "framer-motion";
import DetailsEtat from "../components/DetailsEtat"
const VentePageArr = () => {
  const [venteDetails, setVenteDetails] = useState([]);
  const [venteEtatArrivee, setVenteEtatArrivee] = useState([]);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ pnc: "", matricule: "" });
  const [editedItem, setEditedItem] = useState(null);
  const [pncs, setPncs] = useState([]); // State to store PNCs

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [response, etatArriveeResponse, pncResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/ListeEquipageV"),
          axios.get("http://localhost:5000/api/EtatVentesArrivee"),
          axios.get("http://localhost:5000/api/pn"), // Fetch PNCs from the PN table
        ]);
        setVenteDetails(response.data);
        setVenteEtatArrivee(etatArriveeResponse.data);
        setPncs(pncResponse.data); // Store PNCs
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };
    fetchDetails();
  }, []);

  const handleAddNew = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/ListeEquipageV", newItem);
      setVenteDetails([...venteDetails, response.data]);
      setIsAdding(false);
      setNewItem({ pnc: "", matricule: "" });
    } catch (error) {
      setError("Erreur lors de l'ajout.");
    }
  };

  const handleEdit = (item) => {
    setEditedItem(item);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/ListeEquipageV/${editedItem.matricule}`, editedItem);
      setVenteDetails(venteDetails.map(item => (item.matricule === editedItem.matricule ? editedItem : item)));
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
        aria-label="secondary tabs example"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#B71C1C",
          },
          "& .MuiTab-root": {
            transition: "color 0.3s ease-in-out",
          },
          "& .Mui-selected": {
            color: "#B71C1C !important",
          },
        }}
      >
        <Tab 
          label="Liste Equipage"  
          icon={<motion.div whileHover={{ scale: 1.2 }}><Users /></motion.div>} 
        />
        <Tab 
          label="État Ventes Fournisseurs" 
          icon={<motion.div whileHover={{ scale: 1.2 }}><ShoppingBag /></motion.div>} 
        />
      </Tabs>
      {tabValue === 0 && (
        <div>
          
          <DetailsEtat data={DetailsEtat} />
          <Button variant="contained" color="primary" startIcon={<Plus />} onClick={() => setIsAdding(true)}>
            Ajouter
          </Button>
          <table style={{ width: "70%", borderCollapse: "collapse", marginTop: "1rem", marginLeft: "auto", marginRight: "auto", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", overflow: "hidden" }}>
            <thead>
              <tr style={{ backgroundColor: "#b71c1c", color: "#ffffff" }}>
                <th style={{ padding: "0.8rem", fontSize: "0.9rem", fontWeight: "600", borderBottom: "2px solid #880e0e", textAlign: "left" }}>PNC</th>
                <th style={{ padding: "0.8rem", fontSize: "0.9rem", fontWeight: "600", borderBottom: "2px solid #880e0e", textAlign: "left" }}>Matricule</th>
                <th style={{ padding: "0.8rem", fontSize: "0.9rem", fontWeight: "600", borderBottom: "2px solid #880e0e", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
            {isAdding && (
                <tr style={{ transition: "background 0.3s ease-in-out" }}>
                  <td style={{ padding: "0.7rem", fontSize: "0.85rem", borderBottom: "1px solid #ddd", textAlign: "left", color: "#333" }}>
                    <Autocomplete
                      options={pncs}
                      getOptionLabel={(option) => option.nom}
                      onChange={(e, newValue) => {
                        setNewItem({ pnc: newValue?.nom || "", matricule: newValue?.matricule || "" });
                      }}
                      renderInput={(params) => <TextField {...params} label="PNC" />}
                    />
                  </td>
                  <td style={{ padding: "0.7rem", fontSize: "0.85rem", borderBottom: "1px solid #ddd", textAlign: "left", color: "#333" }}>
                    <TextField value={newItem.matricule} disabled />
                  </td>
                  <td  style={{ padding: "0.7rem", fontSize: "0.85rem", borderBottom: "1px solid #ddd", textAlign: "left", color: "#333" }}>
                    <Save onClick={handleAddNew} style={{ color: "green", cursor: "pointer" }} />
                    <X onClick={() => setIsAdding(false)} style={{ color: "red", cursor: "pointer" }} />
                  </td>
                </tr>
              )}
              {venteDetails.map((item, index) => {
                const isEditing = editedItem && editedItem.matricule === item.matricule;
                return (
                  <tr key={index} style={{ transition: "background 0.3s ease-in-out" }}>
                    <td style={{ padding: "0.7rem", fontSize: "0.85rem", borderBottom: "1px solid #ddd", textAlign: "left", color: "#333" }}>
                      {isEditing ? (
                        <TextField
                          value={editedItem.pnc}
                          onChange={(e) => setEditedItem({ ...editedItem, pnc: e.target.value })}
                        />
                      ) : (
                        item.pnc
                      )}
                    </td>
                    <td style={{ padding: "0.7rem", fontSize: "0.85rem", borderBottom: "1px solid #ddd", textAlign: "left", color: "#333" }}>
                      {isEditing ? (
                        <TextField
                          value={editedItem.matricule}
                          onChange={(e) => setEditedItem({ ...editedItem, matricule: e.target.value })}
                        />
                      ) : (
                        item.matricule
                      )}
                    </td>
                    <td style={{ padding: "0.7rem", fontSize: "0.85rem", borderBottom: "1px solid #ddd", textAlign: "left", color: "#333" }}>
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

      {tabValue === 1 && <EtatVentesArriveeTable data={venteEtatArrivee} />}
    </div>
  );
};

export default VentePageArr;

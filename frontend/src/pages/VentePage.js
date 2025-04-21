import React, { useState, useEffect } from "react";
import axios from "axios";
import EtatVentesDepartTable from "../components/EtatVentesDepartTable";
import { Edit, Trash, Plus, Save, X, Users, ShoppingBag, Undo2 } from "lucide-react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Button, TextField, Autocomplete } from "@mui/material";
import { motion } from "framer-motion";
import DetailsEtat from "../components/DetailsEtat";
import { useNavigate, useParams } from "react-router-dom";

const VentePage = () => {
  const [venteDetails, setVenteDetails] = useState([]);
  const [venteEtatDepart, setVenteEtatDepart] = useState([]);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ pnc: "", matricule: "" });
  const [editedItem, setEditedItem] = useState(null);
  const [pncs, setPncs] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipageResponse, etatDepartResponse, pncResponse, enteteVenteResponse ] = await Promise.all([
          axios.get("http://localhost:5000/api/ListeEquipageV"),
          axios.get("http://localhost:5000/api/EtatVentesDepart"),
          axios.get("http://localhost:5000/api/pn"),
          axios.get(`http://localhost:5000/api/entetevente/${id}`),
        ]);

        const filteredEquipage = equipageResponse.data.filter(item => item.enteteVenteID === parseInt(id));

        setVenteDetails(filteredEquipage);

        setVenteEtatDepart(etatDepartResponse.data);
        setPncs(pncResponse.data);
        setEnteteVente(enteteVenteResponse.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    if (id) fetchData();
  }, [id]);

  const [enteteVente, setEnteteVente] = useState(null);

  const handleAddNew = async () => {
    try {
      const currentId = parseInt(id);
      
      // Vérifie seulement s'il est déjà dans CET état
      const isAlreadyAdded = venteDetails.some(
        item => item.matricule === newItem.matricule && item.enteteVenteID === currentId
      );
  
      if (isAlreadyAdded) {
        setError("Cet équipage a déjà été ajouté à cet état.");
        return;
      }
  
      // Envoie la requête avec le BON EnteteVenteID
      const response = await axios.post(`http://localhost:5000/api/ListeEquipageV`, {
        ...newItem,
        enteteVenteID: currentId // Utilise l'ID courant de l'URL
      });
  
      // Met à jour l'affichage avec le nouvel équipage
      setVenteDetails([...venteDetails, response.data]);
      setIsAdding(false);
      setNewItem({ pnc: "", matricule: "" });
      setError(null);
    } catch (error) {
      setError(error.response?.data || "Erreur lors de l'ajout.");
    }
  };
  

  const handleEdit = (item) => {
    setEditedItem(item);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/ListeEquipageV/${editedItem.matricule}`, editedItem);
      setVenteDetails(
        venteDetails.map(item =>
          item.matricule === editedItem.matricule ? editedItem : item
        )
      );
      setEditedItem(null);
    } catch (error) {
      setError("Erreur lors de la modification.");
    }
  };

  const handleDelete = async (matricule) => {
    try {
      await axios.delete(`http://localhost:5000/api/ListeEquipageV/${matricule}`)
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
        <Tab label="Liste Équipage" icon={<motion.div whileHover={{ scale: 1.2 }}><Users /></motion.div>} />
        <Tab label="État Ventes Tunisair" icon={<motion.div whileHover={{ scale: 1.2 }}><ShoppingBag /></motion.div>} />
      </Tabs>

      <Undo2
        style={{ cursor: "pointer", color: "#B71C1C" }}
        size={28}
        onClick={() => navigate(-1)}
      />

      {tabValue === 0 && (
        <div>
          <DetailsEtat />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus />}
            onClick={() => setIsAdding(true)}
            style={{ marginTop: "1rem" }}
          >
            Ajouter
          </Button>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
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

{tabValue === 1 && venteEtatDepart && venteEtatDepart.length > 0 && (
  <EtatVentesDepartTable data={venteEtatDepart} />
)}
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

export default VentePage;
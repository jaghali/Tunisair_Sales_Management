import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCurrency } from "../pages/CurrencyContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Trash, Save, X, Plus , Euro  } from "lucide-react";
import { motion } from "framer-motion";

const EnteteVente = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fourniss, setFourniss] = useState([]);
  const [DetailFL, setDetailFL] = useState([]);
  const [pnList, setPnList] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [etatVenteArrivee, setEtatVenteDepart] = useState([]);
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
      const { currency } = useCurrency();
      const symbol = getCurrencySymbol(currency);

  const [newItem, setNewItem] = useState({
    fournisseur: "",
    airoport: "",
    datE_EDITION: "",
    numerO_ETAT: "",
    fL01: "",
    fL02: "",
    fL03: "",
    cC1: "",
    pnC1: "",
    noM1: "",
    noM2: "",
    cC2: "",
    pnC2: "",
    agenT_SAISIE: "",
    statut: "Not Approved",
  });

  const handleSaveTotalEncaisse = async (id, totaleEncaisse) => {
    try {
      const updatedRow = data.find((row) => row.id === id);
      updatedRow.totaleEncaisse = totaleEncaisse;
      await axios.put(`http://localhost:5000/api/EnteteVente/${id}`, updatedRow);
      setData(data.map((row) => (row.id === id ? updatedRow : row)));
    } catch (err) {
      alert("Erreur lors de la mise à jour du TotaleEncaisse!");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enteteRes = await axios.get("http://localhost:5000/api/EnteteVente");
        const departRes = await axios.get("http://localhost:5000/api/EtatVentesDepart");
        
  
        const entetes = enteteRes.data;
        const lignesDepart = departRes.data;
  
        // Calcul pour chaque ligne EnteteVente
        await Promise.all(entetes.map(async (entete) => {
          // Filtrer les lignes de vente départ avec le même enteteVenteID
          const lignesLiees = lignesDepart.filter(ld => ld.enteteVenteID === entete.id);
          const totalValeur = lignesLiees.reduce((sum, ligne) => sum + ligne.valeur, 0);
  
          // Mettre à jour la ligne si nécessaire
          if (entete.totaleValeur !== totalValeur) {
            const updated = { ...entete, totaleValeur: totalValeur };
            await axios.put(`http://localhost:5000/api/EnteteVente/${entete.id}`, updated);
          }
        }));
  
        // Mise à jour de l'état local après les modifications
        const refreshed = await axios.get("http://localhost:5000/api/EnteteVente");
        
        const fournRes = await axios.get("http://localhost:5000/api/Fournisseurs");
        const Detfl = await axios.get("http://localhost:5000/api/detailfl");
        const pnRes = await axios.get("http://localhost:5000/api/pn");

        setDetailFL(Detfl.data);
        setPnList(pnRes.data);
        setFourniss(fournRes.data);

        setData(refreshed.data);
        setEtatVenteDepart(lignesDepart); 
  
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement ou de la mise à jour.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleEdit = (item) => {
    console.log("Editing item:", item);
    setIsEditing(item.id);
    setEditedItem({ ...item });
  };

  const handleSaveEdit = async (newData) => {
    try {
      await axios.put(`http://localhost:5000/api/EnteteVente/${newData.id}`, newData);
      setData(data.map((row) => (row.id === newData.id ? newData : row)));
      setIsEditing(null);
      setEditedItem(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour !");
    }
  };

  const validateNewItem = (item) => {
    const errors = [];
    if (typeof item.numerO_ETAT !== "string") errors.push("Numéro État doit être une chaîne.");
    if (typeof item.fournisseur !== "string") errors.push("fournisseur doit être une chaîne.");
    if (typeof item.airoport !== "string") errors.push("Aéroport doit être une chaîne.");
    if (isNaN(Date.parse(item.datE_EDITION))) errors.push("Date Edition doit être une date valide.");
    if (typeof item.agenT_SAISIE !== "string") errors.push("Agent Saisie doit être une chaîne.");
    if (isNaN(Number(item.fL01))) errors.push("FL 01 doit être un nombre.");
    if (isNaN(Number(item.fL02))) errors.push("FL 02 doit être un nombre.");
    if (isNaN(Number(item.fL03))) errors.push("FL 03 doit être un nombre.");
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };

  const handleAddNew = async () => {
    if (!validateNewItem(newItem)) return;
    try {
      const response = await axios.post("http://localhost:5000/api/EnteteVente", newItem);
      setData([...data, response.data]);
      setOpenForm(false);
    } catch (err) {
      alert("Erreur lors de l'ajout !");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedItem(null);
    setOpenForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/EnteteVente/${id}`);
        setData(data.filter((row) => row.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression !");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Etat Des Ventes Tunisair</h2>
      <motion.button
        onClick={() => setOpenForm(true)}
        style={styles.addButton}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Plus style={styles.icon} />
        Ajouter Etat De Vente
      </motion.button>

      {loading && <div style={styles.loader}>Chargement...</div>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                {["FOURNISSEUR", "AIROPORT", "DATE_EDITION", "NUMERO_ETAT", "PNC_1", 'TotaleValeur', 'TotaleEncaisse', "Status", "Actions", "Details"].map((header) => (
                  <th key={header} style={styles.headerCell}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id}>
                    <td style={styles.cell}>{row.fournisseur}</td>
                    <td style={styles.cell}>{row.airoport}</td>
                    <td style={styles.cell}>{row.datE_EDITION}</td>
                    <td style={styles.cell}>{row.numerO_ETAT}</td>
                    <td style={styles.cell}>{row.pnC1}</td>
                    <td style={styles.cell}>{row.totaleValeur} {symbol}</td>
                    <td style={styles.cell}>
                      {isEditing === row.id ? (
                        <TextField
                          value={editedItem?.totaleEncaisse || ""}
                          onChange={(e) => setEditedItem({ ...editedItem, totaleEncaisse: e.target.value })}
                          onBlur={() => handleSaveTotalEncaisse(row.id, editedItem.totaleEncaisse)}
                          fullWidth
                        />
                      ) : (
                        parseFloat(row.totaleEncaisse).toFixed(2)
                      )} {symbol}

                    </td>
                    <td style={styles.cell}>
  <div
    style={{
      backgroundColor: row.statut === "Approved" ? "#D1FAE5" : "#ffcccb",
      borderRadius: "20px",
      color: row.statut === "Approved" ? "#0f543f" : "#C80505",
      padding: "10px",
      textAlign: "center",
      fontWeight: "bold",
    }}
  >
    {row.statut}
  </div>
</td>

                    <td style={styles.cell}>
                      {isEditing === row.id ? (
                        <>
                          <Save onClick={() => handleSaveEdit(editedItem)} style={{ ...styles.icon, color: "#00a3f5", cursor: "pointer" }} />
                          <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red", cursor: "pointer" }} />
                        </>
                      ) : (
                        <>
                          <Edit onClick={() => handleEdit(row)} style={{ ...styles.icon, color: "#00a3f5", cursor: "pointer" }} />
                          <Trash onClick={() => handleDelete(row.id)} style={{ ...styles.icon, color: "#e74c3c", cursor: "pointer" }} />
                        </>
                      )}
                    </td>
                    <td style={styles.cell}>
                      <Link to={`/ventePage/${row.id}`}>
                        <Button>View More ...</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={styles.noData}>Aucune donnée trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Ajouter Etat De Vente</DialogTitle>
<DialogContent>
          <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
          <TextField label="Numéro Etat" value={newItem.numerO_ETAT} onChange={(e) => setNewItem({ ...newItem, numerO_ETAT: e.target.value })} fullWidth />

          <Select
  value={newItem.fournisseur}
  onChange={(e) => setNewItem({ ...newItem, fournisseur: e.target.value })}
  fullWidth
  displayEmpty
>
  <MenuItem value="" disabled>
    <em>Fournisseur</em>
  </MenuItem>
  {fourniss.map((f) => (
    <MenuItem key={f.id} value={f.nom}>
      {f.nom}
    </MenuItem>
  ))}
</Select>

          </div>
          <div style={{ display: "flex", gap: "15px" , marginBottom: "10px"}}>
          <TextField label="Airoport" value={newItem.airoport} onChange={(e) => setNewItem({ ...newItem, airoport: e.target.value })} fullWidth />

          <TextField label="Date Edition" type="date" InputLabelProps={{ shrink: true }} value={newItem.datE_EDITION} onChange={(e) => setNewItem({ ...newItem, datE_EDITION: e.target.value })} fullWidth />
          </div>
          
          
          <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
          <Select
  value={newItem.fL01}
  onChange={(e) => {
    const selectedNumfl = e.target.value;
    const selectedDetail = DetailFL.find(item => item.numfl === selectedNumfl);
    console.log("Selected detail:", selectedDetail);
    const matchedPn = selectedDetail 
    ? pnList.find(pn => Number(pn.matricule) === Number(selectedDetail.mat))
    : null;
    console.log("Matched PNC:", matchedPn);

    setNewItem({
      ...newItem,
      fL01: selectedNumfl,
      pnC1: selectedDetail ? selectedDetail.mat : '' , // auto-remplissage de PNC1
      noM1: matchedPn ? matchedPn.nom : '' // auto-remplissage NOM1
    });
  }}
  fullWidth
  displayEmpty
>
  <MenuItem value="" disabled>
    <em>FL01</em>
  </MenuItem>
  {DetailFL.map((item) => (
    <MenuItem key={item.id} value={item.numfl}>
      {item.numfl}
    </MenuItem>
  ))}
</Select>


         
<Select
  value={newItem.fL02}
  onChange={(e) => {
    const selectedNumfl = e.target.value;
    const selectedDetail = DetailFL.find(item => item.numfl === selectedNumfl);
    console.log("Selected detail:", selectedDetail);
    const matchedPn = selectedDetail 
    ? pnList.find(pn => Number(pn.matricule) === Number(selectedDetail.mat))
    : null;
    console.log("Matched PNC:", matchedPn);

    setNewItem({
      ...newItem,
      fL02: selectedNumfl,
      pnC2: selectedDetail ? selectedDetail.mat : '' , // auto-remplissage de PNC1
      noM2: matchedPn ? matchedPn.nom : '' // auto-remplissage NOM1
    });
  }}
  fullWidth
  displayEmpty
>
  <MenuItem value="" disabled>
    <em>FL02</em>
  </MenuItem>
  {DetailFL.map((item) => (
    <MenuItem key={item.id} value={item.numfl}>
      {item.numfl}
    </MenuItem>
  ))}
</Select>
            
          </div>
          <div style={{ display: "flex", gap: "15px" , marginBottom: "10px"}}>
          <Select
      fullWidth
      value={newItem.cC1}
      onChange={(e) => setNewItem({ ...newItem, cC1: e.target.value })}
      displayEmpty
    >
      <MenuItem value="" disabled>CC1</MenuItem>
      {pnList
        .filter(p => p.college === "C/C")
        .map((pn) => (
          <MenuItem key={pn.id} value={pn.nom}>{pn.nom}</MenuItem>
        ))}
    </Select>
          <TextField
          disabled
        label="PNC 1"
        value={newItem.pnC1}
        onChange={(e) => setNewItem({ ...newItem, pnC1: e.target.value })}
        fullWidth
          />            
          <TextField disabled label="noM 1" value={newItem.noM1} onChange={(e) => setNewItem({ ...newItem, noM1: e.target.value })} fullWidth />       
          </div>  
          <div style={{ display: "flex", gap: "15px" , marginBottom: "10px"}}>
          <TextField disabled label="noM 2" value={newItem.noM2} onChange={(e) => setNewItem({ ...newItem, noM2: e.target.value })} fullWidth />
          <Select
      fullWidth
      value={newItem.cC2}
      onChange={(e) => setNewItem({ ...newItem, cC2: e.target.value })}
      displayEmpty
    >
      <MenuItem value="" disabled fullWidth >CC2</MenuItem>
      {pnList
        .filter(p => p.college === "C/C")
        .map((pn) => (
          <MenuItem key={pn.id} value={pn.nom}>{pn.nom}</MenuItem>
        ))}
    </Select>
          <TextField disabled label="PNC 2" value={newItem.pnC2} onChange={(e) => setNewItem({ ...newItem, pnC2: e.target.value })} fullWidth />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">Annuler</Button>
          <Button onClick={handleAddNew} color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = {
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#C80505",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "50%",
  },
  container: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
  },
  heading: {
    flex: 1,
    marginRight: "500px",
    marginTop: "50px",
  },
  table: {
    borderCollapse: "collapse",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    width: "90%",
    marginTop: "8%",
    marginLeft: "15%",
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
  },
  cell: {
    padding: "10px",
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    fontWeight: "bold",
  },
};

export default EnteteVente;

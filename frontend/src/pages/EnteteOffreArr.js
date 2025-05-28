import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle ,TextField,Select,MenuItem,} from "@mui/material";
import { Edit, Trash, Save, X ,  Plus } from "lucide-react";
import { motion } from 'framer-motion';

const EnteteOffreArr = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fourniss, setFourniss] = useState([]);
  const [DetailFL, setDetailFL] = useState([]);
  const [pnList, setPnList] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [newItem, setNewItem] = useState({ avion: "", airoport: "", datE_EDITION: "", numerO_ETAT: "",fL01:"" ,fL02:"" , fL03:"",cC1:"", pnC1: "" , noM1:"" ,noM2:"" , cC2:""  , pnC2: "" ,agenT_SAISIE: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/EnteteOffre");
        setData(response.data);
        const fournRes = await axios.get("http://localhost:5000/api/Fournisseurs");
        const Detfl = await axios.get("http://localhost:5000/api/detailfl");
        const pnRes = await axios.get("http://localhost:5000/api/pn");

        setDetailFL(Detfl.data);
        setPnList(pnRes.data);
        setFourniss(fournRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setIsEditing(item.id);
    setEditedItem({ ...item });
  };

  const handleSaveEdit = async (newData) => {
    try {
      await axios.put(`http://localhost:5000/api/EnteteOffre/${newData.id}`, newData);
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
    if (typeof item.avion !== "string") errors.push("Avion doit être une chaîne.");
    if (typeof item.airoport !== "string") errors.push("Aéroport doit être une chaîne.");
    if (isNaN(Date.parse(item.datE_EDITION))) errors.push("Date Edition doit être une date valide.");
    if (typeof item.agenT_SAISIE !== "string") errors.push("Agent Saisie doit être une chaîne.");
    if (isNaN(Number(item.fL01))) errors.push("FL 01 doit être un nombre.");
    if (isNaN(Number(item.fL02))) errors.push("FL 02 doit être un nombre.");
    if (isNaN(Number(item.fL03))) errors.push("FL 03 doit être un nombre.");
  
    if (errors.length > 0) {
      console.error("Erreurs de validation :", errors);
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };
  

  const handleAddNew = async () => {
    if (!validateNewItem(newItem)) return; // Vérification avant d'envoyer
    
    try {
      const response = await axios.post("http://localhost:5000/api/EnteteOffre", newItem);
      setData([...data, response.data]);
      setOpenForm(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err.response?.data || err.message);
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
        await axios.delete(`http://localhost:5000/api/EnteteOffre/${id}`);
        setData(data.filter((row) => row.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression !");
      }
    }
  };

  return (
    <div style={styles.container}>
        <h2 style={styles.heading}>Etat Des Offres Fournisseur</h2>

    
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
                {['AVION', 'AIROPORT', 'DATE_EDITION', 'NUMERO_ETAT', 'PNC_1', 'Actions', 'Details'].map(header => (
                  <th key={header} style={styles.headerCell}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id}>
                    {['avion', 'airoport', 'datE_EDITION', 'numerO_ETAT',  'pnC1'  ].map((field) => (
                      <td key={field} style={styles.cell}>
                        {isEditing === row.id ? (
                          <input type="text" value={editedItem[field]} onChange={(e) => setEditedItem({ ...editedItem, [field]: e.target.value })} />
                        ) : (
                          row[field]
                        )}
                      </td>
                    ))}
                    <td style={styles.cell}>
                      {isEditing === row.id ? (
                        <>
                          <Save onClick={() => handleSaveEdit(editedItem)} style={{ ...styles.icon,  color: "#00a3f5", cursor:"pointer"}} />
                          <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red" , cursor:"pointer"}} />
                        </>
                      ) : (
                        <>
                          <Edit onClick={() => handleEdit(row)} style={{ ...styles.icon, color: "#00a3f5" , cursor:"pointer"}} />
                          <Trash onClick={() => handleDelete(row.id)} style={{ ...styles.icon, color: "#e74c3c" , cursor:"pointer"}} />
                        </>
                      )}
                    </td>
                    <Link to={`/OffrePagearr/${row.id}`}>
                        <Button>View More ...</Button>
                    </Link>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.noData}>Aucune donnée trouvée.</td>
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
  value={newItem.avion}
  onChange={(e) => setNewItem({ ...newItem, avion: e.target.value })}
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
    padding: '10px 20px',
    backgroundColor: '#C80505',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft:"50%",
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
    marginRight:"500px",
    marginTop:"50px"
  },
  searchInput: {
    maxWidth: "400px",
    marginRight: "10px", 
  },
  table: {
    borderCollapse: "collapse",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
    marginTop:"10%",
    marginLeft:"5%",
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
  row: {
    transition: "background 0.3s",
    borderBottom: "1px solid #ddd",
  },
  cell: {
    padding: "10px",
    color: "#333",
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

export default EnteteOffreArr;
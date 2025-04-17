import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftRight } from "lucide-react";
import { IconButton, Dialog, DialogActions, DialogContent} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

// Formulaire d'ajout
function AjoutDeviseForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ nom: "", code: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nom: "", code: "" });
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "20px auto" }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Ajouter une Devise
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              size="small"
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
            <TextField
              size="small"
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
            <Box display="flex" justifyContent="space-between">
              <Button type="submit" variant="contained" size="small">
                Ajouter
              </Button>
              <Button onClick={onCancel} variant="outlined" size="small">
                Annuler
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}

// Formulaire de mise à jour
function UpdateDeviseForm({ formData, onChange, onCancel, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Modifier la Devise
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={onChange}
            variant="outlined"
            required
          />
          <TextField
            label="Code"
            name="code"
            value={formData.code}
            onChange={onChange}
            variant="outlined"
            required
          />
          <Box display="flex" gap={2}>
            <Button type="submit" variant="contained" color="primary">
              Mettre à jour
            </Button>
            <Button onClick={onCancel} variant="outlined" color="secondary">
              Annuler
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default function Devise() {
  const [currency, setCurrency] = useState("TND");
  const [rate, setRate] = useState(null);
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState("");
  const [devises, setDevises] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const API_URL = "http://localhost:5000/api/Devise";

  const loadDevises = async () => {
    const res = await axios.get(API_URL);
    setDevises(res.data);
  };

  useEffect(() => {
    loadDevises();
  }, []);

  const handleAdd = async (data) => {
    await axios.post(API_URL, data);
    loadDevises();
    setOpenDialog(false);
  };

  const handleUpdate = async (data) => {
    await axios.put(`${API_URL}/${data.id}`, data);
    setEditData(null);
    loadDevises();
  };

  const handleEdit = (data) => setEditData(data);

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    loadDevises();
  };

  const handleCancelUpdate = () => setEditData(null);

  // Récupération du taux de change
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/ExchangeRate/${currency}`)
      .then((res) => {
        const fetchedRate = res.data.rate;
        setRate(fetchedRate);
        setConverted((amount * fetchedRate).toFixed(2));
      })
      .catch((err) => console.error("Erreur:", err));
  }, [currency]);

  useEffect(() => {
    if (rate) setConverted((amount * rate).toFixed(2));
  }, [amount]);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="p-4">
      {!showAddForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          style={{
            position: "absolute",
            right: "423px",
          }}
        >
          Ajouter Devise
        </Button>
      )}

      { showAddForm ? (
        <AjoutDeviseForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} />
      ) : null}

      <Dialog open={openDialog} onClose={() => { setShowAddForm(false); setOpenDialog(false); }}>
        <DialogContent>
          <AjoutDeviseForm onSubmit={handleAdd} onCancel={() =>  { setShowAddForm(false); setOpenDialog(false); }} />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <Typography variant="h5" mt={4} mb={2}>
        Liste des Devises
      </Typography>
      <Grid item xs={12} md={5}>
        <Paper sx={{ maxWidth: 500, margin: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devises.map((d) => (
                <TableRow key={d.id}>
                  {editData && editData.id === d.id ? (
                    <TableCell colSpan={4}>
                      <UpdateDeviseForm
                        formData={editData}
                        onChange={(e) =>
                          setEditData({ ...editData, [e.target.name]: e.target.value })
                        }
                        onSubmit={handleUpdate}
                        onCancel={handleCancelUpdate}
                      />
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>{d.id}</TableCell>
                      <TableCell>{d.nom}</TableCell>
                      <TableCell>{d.code}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton color="primary" onClick={() => handleEdit(d)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(d.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
        {/* Convertisseur de devises */}
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#E5E6EB",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
            minWidth: "320px",
            fontFamily: "Arial",
            textAlign: "center",
          }}
        >
          <h2>Convertisseur de devises</h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={{ color: "black" }}>Montant (EUR):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  padding: "8px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "22px",
                marginLeft: "3%",
              }}
            >
              <ArrowLeftRight size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ color: "black" }}>Convert en {currency}:</label>
              <input
                type="text"
                value={converted}
                readOnly
                style={{
                  padding: "8px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
          </div>

          {/* Sélecteur de devise */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ color: "black" }}>Choisir la devise :</label>
            <div
              onClick={() => setIsOpen(!isOpen)}
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginTop: "5px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <span>{currency}</span>
              <span>{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
              <div
                style={{
                  marginTop: "10px",
                  borderRadius: "6px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #ccc",
                  maxHeight: "200px",
                  overflowY: "auto",
                  backgroundColor: "#fff",
                  color: "black",
                }}
              >
                <div onClick={() => handleCurrencyChange("TND")} style={{ padding: "10px", cursor: "pointer" }}>TND</div>
                <div onClick={() => handleCurrencyChange("USD")} style={{ padding: "10px", cursor: "pointer" }}>USD</div>
                <div onClick={() => handleCurrencyChange("GBP")} style={{ padding: "10px", cursor: "pointer" }}>GBP</div>
                <div onClick={() => handleCurrencyChange("EUR")} style={{ padding: "10px", cursor: "pointer" }}>EUR</div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

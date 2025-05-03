import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftRight } from "lucide-react";
import { useCurrency } from "../pages/CurrencyContext";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [converterCurrency, setConverterCurrency] = useState("TND"); // convertisseur
  const [rate, setRate] = useState(null);
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState("");
  const [devises, setDevises] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { currency, setCurrency } = useCurrency(); 

  const API_URL = "http://localhost:5000/api/Devise";

  useEffect(() => {
    loadDevises();
    const savedCurrency = localStorage.getItem("trimesterCurrency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const loadDevises = async () => {
    const res = await axios.get(API_URL);
    setDevises(res.data);
  };
  
  const handleCurrencyChange = (event) => {
    const selected = event.target.value;
    setCurrency(selected); // met à jour dans context + localStorage
  };

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


  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/ExchangeRate/${converterCurrency}`)
      .then((res) => {
        const fetchedRate = res.data.rate;
        setRate(fetchedRate);
        setConverted((amount * fetchedRate).toFixed(2));
      })
      .catch((err) => console.error("Erreur:", err));
  }, [converterCurrency]);

  useEffect(() => {
    if (rate) setConverted((amount * rate).toFixed(2));
  }, [amount, rate]);

  return (
    <div className="p-4">
      <Box mt={5} mb={3} ml={40}>
        <h2> Select Devise To use </h2>
        <FormControl size="small">
          <InputLabel>Devise</InputLabel>
          <Select value={currency} label="Devise" onChange={handleCurrencyChange}>
            <MenuItem value="TND">TND</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ position: "absolute", right: "423px" }}
      >
        Ajouter Devise
      </Button>

      {showAddForm && (
        <AjoutDeviseForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <AjoutDeviseForm
            onSubmit={handleAdd}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
        <DialogActions />
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
                          setEditData({
                            ...editData,
                            [e.target.name]: e.target.value,
                          })
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

      {/* Convertisseur */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <div
          style={{
            backgroundColor: "#E5E6EB",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
            minWidth: "340px",
            fontFamily: "Arial",
            textAlign: "center",
          }}
        >
          <h2>Convertisseur de devises</h2>

          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Montant (EUR)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              size="small"
            />
            <ArrowLeftRight size={24} style={{ alignSelf: "center" }} />
            <TextField
              label={`Converti en ${converterCurrency}`}
              value={converted}
              InputProps={{ readOnly: true }}
              fullWidth
              size="small"
            />
          </Box>

          <FormControl fullWidth size="small">
            <InputLabel>Devise convertisseur</InputLabel>
            <Select
              value={converterCurrency}
              label="Devise convertisseur"
              onChange={(e) => setConverterCurrency(e.target.value)}
            >
              <MenuItem value="TND">TND</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}

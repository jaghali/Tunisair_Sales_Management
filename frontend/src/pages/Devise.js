import { useEffect, useState } from "react";
import axios from "axios";
import { useCurrency } from "../pages/CurrencyContext";
import {
  IconButton,
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
  FormControl,
  InputLabel,
  Dialog,
  MenuItem,
  Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash, Save, X, Plus, Euro } from "lucide-react";
import Form from "../components/Form";

export default function Devise() {
  const [converterCurrency, setConverterCurrency] = useState("TND");
  const [rate, setRate] = useState(null);
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState("");
  const [devises, setDevises] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [ajoutFormData, setAjoutFormData] = useState({ nom: "", code: "" });
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
    setCurrency(selected);
    localStorage.setItem("trimesterCurrency", selected);
  };

  const handleAdd = async (data) => {
    await axios.post(API_URL, data);
    loadDevises();
    setShowAddForm(false);
    setAjoutFormData({ nom: "", code: "" });
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
    <div>
      <Box mt={5} mb={3} ml={40}>
        <h2>Select Devise To use</h2>
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

        

        <motion.button
          onClick={() => setShowAddForm(true)}
          style={styles.addButton}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus style={styles.icon} /> Ajouter Devise
        </motion.button>

      

      <AnimatePresence>
        {showAddForm && (
          <Form
            open={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAdd}
            title="Ajouter une Devise"
            fields={[
              { name: "nom", label: "Nom" },
              { name: "code", label: "Code" },
            ]}
            values={ajoutFormData}
            onChange={(e) =>
              setAjoutFormData({
                ...ajoutFormData,
                [e.target.name]: e.target.value,
              })
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editData && (
          <Form
            open={!!editData}
            onClose={handleCancelUpdate}
            onSubmit={handleUpdate}
            title="Modifier la Devise"
            fields={[
              { name: "nom", label: "Nom" },
              { name: "code", label: "Code" },
            ]}
            values={editData}
            onChange={(e) =>
              setEditData({ ...editData, [e.target.name]: e.target.value })
            }
            submitLabel="Mettre à jour"
          />
        )}
      </AnimatePresence>

      <div style={styles.boxcrud}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </div>
    </div>
  );
}

const styles = {
  Buttons: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
    gap: "18%",
    marginLeft: "10%",
  },
  boxcrud: {
    marginLeft: "10%",
    marginTop: "2%",
  },
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
    marginLeft:"39%"
  },
 
  icon: {
    marginRight: "0.5rem",
  },
  boxapi: {
    width: "40%",
    height: "40%",
    borderRadius: "2rem",
    position: "fixed",
    left: "35%",
    top: "20%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    zIndex: 999,
    background: "rgba(255, 255, 255, 0.16)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(13.8px)",
    WebkitBackdropFilter: "blur(13.8px)",
    padding: "30px",
    textAlign: "center",
  },
};

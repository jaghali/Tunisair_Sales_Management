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
import { motion } from 'framer-motion';
import { Pencil, Trash, Save, X, Plus } from "lucide-react";

export default function ApiCurrency() {
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
    <div>
      {/* Convertisseur */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <div
          style={{
            backgroundColor: "#transparent",
            padding: "30px",
            width:"90%",
            height:"200px",
            borderRadius: "12px",
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
            <ArrowLeftRight size={40} style={{ alignSelf: "center" }} />
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
        marginLeft:"60%",
      },
      
    };
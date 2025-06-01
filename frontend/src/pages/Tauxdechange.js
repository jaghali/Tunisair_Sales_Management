import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    IconButton,
    Button,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    Alert
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import ApiCurrency from "../components/ApiCurrency";
import { Pencil, Trash, Save, X, Plus, Euro } from "lucide-react";
import { useCurrency } from "../pages/CurrencyContext";
import { useToast } from "./toast";


const Tauxdechange = () => {
    const [tauxChanges, setTauxChanges] = useState([]);
    const [devises, setDevises] = useState([]);
    const [formData, setFormData] = useState({ valeur:'', date: '', deviseId: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  const [showApiToast, setShowApiToast] = useState(false);


    const apiUrl = 'http://localhost:5000/api/tauxchange';
    const deviseUrl = 'http://localhost:5000/api/Devise';
 function getCurrencySymbol(code) {
      switch (code) {
        case "TND":
          return "TND";
        case "USD":
          return "USD";
        case "EUR":
          return "EUR";
        case "GBP":
          return "GBP";
        default:
          return code;
      }
    }
    const { currency } = useCurrency();
        const { showToast } = useToast();
    
        const symbol = getCurrencySymbol(currency);
    useEffect(() => {
        setLoading(true);
        axios.get(apiUrl)
            .then(response => {
                setTauxChanges(response.data);
                setLoading(false);
            })
            .catch(error => {
                showToast('Erreur lors du chargement des taux de change.');
                setLoading(false);
                console.error('Erreur lors du chargement des taux de change:', error);
            });

        axios.get(deviseUrl)
            .then(response => setDevises(response.data))
            .catch(error => {
                showToast('Erreur lors du chargement des devises.');
                setLoading(false);
                console.error('Erreur lors du chargement des devises:', error);
            });
    }, []);

    const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const selectedDate = new Date(formData.date);
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const selectedDeviseId = parseInt(formData.deviseId);

    const exists = tauxChanges.some((t) => {
        const tDate = new Date(t.date);
        return (
            t.deviseId === selectedDeviseId &&
            tDate.getMonth() === selectedMonth &&
            tDate.getFullYear() === selectedYear &&
            t.id !== editingId 
        );
    });

    if (exists) {
        showToast("Un taux de change pour cette devise existe déjà ce mois-là.");
        return;
    }

    setLoading(true);

    const dataToSubmit = { 
        valeur: parseFloat(formData.valeur),
        date: selectedDate.toISOString(),
        deviseId: selectedDeviseId
    };
    const dataToEdit = { 
        id: editingId, 
        valeur: parseFloat(formData.valeur),
        date: selectedDate.toISOString(),
        deviseId: selectedDeviseId
    };

    const request = editingId 
        ? axios.put(`${apiUrl}/${editingId}`, dataToEdit) 
        : axios.post(apiUrl, dataToSubmit);

    request
        .then(response => {
            const updatedTauxChanges = editingId
                ? tauxChanges.map(t =>
                    t.id === editingId ? { ...dataToSubmit, id: editingId } : t
                )
                : [...tauxChanges, response.data];
                
            setTauxChanges(updatedTauxChanges);
            setFormData({ valeur: '', date: '', deviseId: '' });
            setEditingId(null);
        })
        .catch(error => {
            const errorMessage = error.response ? error.response.data : 'Erreur lors de la requête';
            showToast(`Erreur lors de l'ajout dans ce mois`);
            console.error("Erreur lors de l'ajout/édition:", error);
        })
        .finally(() => setLoading(false));
};


    const handleDelete = (id) => {
        setLoading(true);
        axios.delete(`${apiUrl}/${id}`)
            .then(() => {
                setTauxChanges(tauxChanges.filter(t => t.id !== id));
                setLoading(false);
            })
            .catch(error => {
                showToast('Erreur lors de la suppression.');
                setLoading(false);
                console.error('Erreur lors de la suppression:', error);
            });
    };

    const handleEdit = (taux) => {
        setFormData({
            valeur: taux.valeur,
            date: taux.date ? taux.date.split('T')[0] : '', // Only get the date part of the string
            deviseId: taux.deviseId
        });
        setEditingId(taux.id);
    };

    const getDeviseNom = (id) => {
        const devise = devises.find(d => d.id === id);
        return devise ? devise.nom : 'Inconnu';
    };

    return (
        <Box display="flex">
            <Box width="250px">{/* Sidebar placeholder */}</Box>
            
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gestion des Taux de Change
                </Typography>

                {error && <Alert severity="error">{error}</Alert>} {/* Error message */}
                
                {/* Formulaire */}
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Valeur"
                                fullWidth
                                variant="standard"
                                value={formData.valeur}
                                onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                type="month"
                                label="Month"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="devise-label">Devise</InputLabel>
                                <Select
                                    labelId="devise-label"
                                    value={formData.deviseId}
                                    onChange={(e) => setFormData({ ...formData, deviseId: e.target.value })}
                                    required
                                >
                                    {devises.map((devise) => (
                                        <MenuItem key={devise.id} value={devise.id}>
                                            {devise.nom}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            
                            <div style={styles.Buttons}>
                                    <motion.button
                                      onClick={() => setShowApiToast(true)}
                                      style={styles.ApiButton}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Euro style={styles.icon} /> Api
                                    </motion.button>
                            
                                    <motion.button
                                        type="submit"
                                        style={styles.addButton}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        disabled={loading}
                                        >
                                        {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : (editingId ? 'Mettre à jour' : 'Ajouter')}
                                    </motion.button>

                                  </div>
                            
                        </Grid>
                    </Grid>
                </Box>
                <AnimatePresence>
                        {showApiToast && (
                        <motion.div
                            style={styles.boxapi}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <IconButton
                            aria-label="fermer"
                            onClick={() => setShowApiToast(false)}
                            sx={{
                                position: "absolute",
                                top: 25,
                                right: 8,
                                color: "#C80505",
                                zIndex: 1000,
                            }}
                            >
                            <X />
                            </IconButton>
                            <ApiCurrency />
                        </motion.div>
                        )}
                    </AnimatePresence>
                {/* Tableau */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Valeur</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Devise 1 </strong></TableCell>
                                <TableCell><strong>Devise 2 </strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tauxChanges.map((taux) => (
                                <TableRow key={taux.id}>
                                    <TableCell>{taux.valeur}</TableCell>
                                    <TableCell>{new Date(taux.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{getDeviseNom(taux.deviseId)}</TableCell>
                                    <TableCell>TND</TableCell>

                                    <TableCell align="right">
                                         <Pencil onClick={() => handleEdit(taux)} style={{ ...styles.icon, color: "#00a3f5"  ,cursor:"pointer"}} />
                                          <Trash onClick={() => handleDelete(taux.id)} style={{ ...styles.icon, color: "#e74c3c"  ,cursor:"pointer"}} />
                                     
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default Tauxdechange;

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
  },
  ApiButton: {
    padding: "10px 20px",
    backgroundColor: "#C80505",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
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
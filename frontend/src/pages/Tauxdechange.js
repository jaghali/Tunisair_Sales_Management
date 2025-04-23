import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
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
import { Edit, Delete } from '@mui/icons-material';

const Tauxdechange = () => {
    const [tauxChanges, setTauxChanges] = useState([]);
    const [devises, setDevises] = useState([]);
    const [formData, setFormData] = useState({ valeur: '', date: '', deviseId: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiUrl = 'http://localhost:5000/api/tauxchange';
    const deviseUrl = 'http://localhost:5000/api/Devise';

    useEffect(() => {
        setLoading(true);
        axios.get(apiUrl)
            .then(response => {
                setTauxChanges(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Erreur lors du chargement des taux de change.');
                setLoading(false);
                console.error('Erreur lors du chargement des taux de change:', error);
            });

        axios.get(deviseUrl)
            .then(response => setDevises(response.data))
            .catch(error => {
                setError('Erreur lors du chargement des devises.');
                setLoading(false);
                console.error('Erreur lors du chargement des devises:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const dataToSubmit = { 
            ...formData, 
            date: formData.date ? new Date(formData.date).toISOString() : '' 
        };
    
        const request = editingId 
            ? axios.put(`${apiUrl}/${editingId}`, dataToSubmit) 
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
                setError(`Erreur: ${errorMessage}`);
                console.error('Erreur lors de l\'ajout/édition:', error);
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
                setError('Erreur lors de la suppression.');
                setLoading(false);
                console.error('Erreur lors de la suppression:', error);
            });
    };

    const handleEdit = (taux) => {
        setFormData({
            valeur: taux.valeur,
            date: taux.date.split('T')[0], // Only get the date part of the string
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
                                type="date"
                                label="Date"
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
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                sx={{ height: '100%' }}
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? <CircularProgress size={24} /> : (editingId ? 'Mettre à jour' : 'Ajouter')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* Tableau */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Valeur</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Devise</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tauxChanges.map((taux) => (
                                <TableRow key={taux.id}>
                                    <TableCell>{taux.valeur}</TableCell>
                                    <TableCell>{taux.date}</TableCell>
                                    <TableCell>{getDeviseNom(taux.deviseId)}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            startIcon={<Edit />}
                                            onClick={() => handleEdit(taux)}
                                            sx={{ mr: 1 }}
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={() => handleDelete(taux.id)}
                                        >
                                            Supprimer
                                        </Button>
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Tauxdechange = () => {
    const [tauxChanges, setTauxChanges] = useState([]);
    const [formData, setFormData] = useState({ Valeur: '', Date: '', DeviseId: '' });
    const [editingId, setEditingId] = useState(null);

    const apiUrl = 'http://localhost:5000/api/tauxchange';

    useEffect(() => {
        axios.get(apiUrl)
            .then(response => setTauxChanges(response.data))
            .catch(error => console.error('Erreur lors du chargement des taux de change:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            axios.put(`${apiUrl}/${editingId}`, formData)
                .then(() => {
                    setTauxChanges(tauxChanges.map(t => t.id === editingId ? formData : t));
                    setEditingId(null);
                    setFormData({ Valeur: '', Date: '', DeviseId: '' });
                })
                .catch(error => console.error('Erreur lors de la mise à jour:', error));
        } else {
            axios.post(apiUrl, formData)
                .then(response => {
                    setTauxChanges([...tauxChanges, response.data]);
                    setFormData({ Valeur: '', Date: '', DeviseId: '' });
                })
                .catch(error => console.error('Erreur lors de l\'ajout:', error));
        }
    };

    const handleDelete = (id) => {
        axios.delete(`${apiUrl}/${id}`)
            .then(() => setTauxChanges(tauxChanges.filter(t => t.id !== id)))
            .catch(error => console.error('Erreur lors de la suppression:', error));
    };

    const handleEdit = (taux) => {
        setFormData({ Valeur: taux.valeur, Date: taux.date, DeviseId: taux.deviseId });
        setEditingId(taux.id);
    };

    return (
        <Box display="flex">
            <Box width="250px">{/* Sidebar à gauche */}</Box>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gestion des Taux de Change
                </Typography>

                {/* Formulaire */}
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Valeur"
                                fullWidth
                                variant="standard"
                                
                                value={formData.Valeur}
                                onChange={(e) => setFormData({ ...formData, Valeur: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                type="date"
                                label="Date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={formData.Date}
                                onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                                required
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '100%' }}>
                                {editingId ? 'Mettre à jour' : 'Ajouter'}
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
                
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tauxChanges.map((taux) => (
                                <TableRow key={taux.id}>
                                    <TableCell>{taux.valeur}</TableCell>
                                    <TableCell>{taux.date}</TableCell>
                                    
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

import React, { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const EnteteOffreForm = ({ enteteOffre, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    avion: "",
    airoport: "",
    date_edition: "",
    agent_saisie: "",
    numero_etat: "",
    fl01: "",
    fl02: "",
    fl03: "",
    cc1: "",
    pnc1: "",
    nom1: "",
    nom2: "",
    cc2: "",
    pnc2: "",
  });

  // Remplir le formulaire en mode modification
  useEffect(() => {
    if (enteteOffre) setFormData(enteteOffre);
  }, [enteteOffre]);

  // Mettre à jour les valeurs des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Envoyer les données
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{enteteOffre ? "Modifier" : "Ajouter"} un état de Offre</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField name="avion" label="Avion" value={formData.avion} onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="airoport" label="Aéroport" value={formData.airoport} onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="date_edition" label="Date d'édition" type="date" value={formData.date_edition} onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="agent_saisie" label="Agent de saisie" value={formData.agent_saisie} onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="numero_etat" label="Numéro d'état" value={formData.numero_etat} onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="fl01" label="FL01" value={formData.fl01} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="fl02" label="FL02" value={formData.fl02} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="fl03" label="FL03" value={formData.fl03} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="cc1" label="CC1" value={formData.cc1} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="pnc1" label="PNC1" value={formData.pnc1} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="nom1" label="Nom1" value={formData.nom1} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="nom2" label="Nom2" value={formData.nom2} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="cc2" label="CC2" value={formData.cc2} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="pnc2" label="PNC2" value={formData.pnc2} onChange={handleChange} fullWidth margin="normal" />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnteteOffreForm;

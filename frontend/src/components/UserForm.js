import React, { useState, useEffect } from "react";
import { TextField, Button } from '@mui/material'; 

const UserForm = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    base: "",
    college: "",
    secteur: "",
    password: "",
  });

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="user-form-container">
      <h3>{user ? "Modifier" : "Ajouter"} un utilisateur</h3>
      <form onSubmit={handleSubmit}>
        <TextField
          name="matricule"
          label="Matricule"
          value={formData.matricule}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="nom"
          label="Nom"
          value={formData.nom}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="prenom"
          label="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="base"
          label="Base"
          value={formData.base}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="college"
          label="Collège"
          value={formData.college}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="secteur"
          label="Secteur"
          value={formData.secteur}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="password"
          type="password"
          label="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Enregistrer</Button>
        <Button type="button" onClick={onClose} variant="outlined" color="secondary">Annuler</Button>
      </form>
    </div>
  );
};

export default UserForm;

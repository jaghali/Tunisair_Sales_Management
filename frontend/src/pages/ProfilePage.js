// src/pages/ProfilePage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function ProfilePage() {
  const { matricule } = useParams();
  const [user, setUser] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:5000/api/PN/${matricule}`);
        if (!res.ok) throw new Error("Utilisateur introuvable");
        const data = await res.json();
        setUser(data);
        setEditValues({
          nom: data.nom || "",
          prenom: data.prenom || "",
          base: data.base || 0,
          college: data.college || "",
          secteur: data.secteur || "",
          password: data.password || "",
          avance: data.avance || 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [matricule]);

  const handleChange = (field) => (e) => {
    setEditValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/PN/${matricule}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      if (!res.ok) throw new Error("Échec de la mise à jour");
      const updated = await res.json();
      setUser(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setEditValues({
      nom: user.nom,
      prenom: user.prenom,
      base: user.base,
      college: user.college,
      secteur: user.secteur,
      password: user.password,
      avance: user.avance,
    });
    setError("");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">Aucun utilisateur trouvé avec le matricule #{matricule}.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Profil de {user.prenom} {user.nom} (#{user.matricule})
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {[
            { label: "Nom", field: "nom" },
            { label: "Prénom", field: "prenom" },
            { label: "Base", field: "base" },
            { label: "Avance", field: "avance" },
            { label: "Collège", field: "college" },
            { label: "Secteur", field: "secteur" },
          ].map(({ label, field, type }) => (
            <Grid item xs={12} key={field}>
              <TextField
                fullWidth
                label={label}
                value={editValues[field]}
                type={type || "text"}
                onChange={handleChange(field)}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              value={editValues.password}
              onChange={handleChange("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
          <Button variant="outlined" onClick={handleCancel} disabled={saving}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving && <CircularProgress size={16} />}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

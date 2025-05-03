import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TablePagination, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import { useParams } from 'react-router-dom';
import {  Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../pages/CurrencyContext";

const Confrontation = () => {
  const [etatVenteDepart, setEtatVenteDepart] = useState([]);
  const [etatVenteArrivee, setEtatVenteArrivee] = useState([]);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [selectedStatus, setSelectedStatus] = useState(""); // Statut global sélectionné
  const [confrontationData, setConfrontationData] = useState([]);
  const navigate = useNavigate();
  function getCurrencySymbol(code) {
    switch (code) {
      case "TND":
        return "DT";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return code;
    }
  }
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);
  const { id } = useParams(); // ID de EnteteVente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDepart = await axios.get("http://localhost:5000/api/EtatVentesDepart");
        const responseArrivee = await axios.get("http://localhost:5000/api/EtatVentesarrivee");
        setEtatVenteDepart(responseDepart.data);
        setEtatVenteArrivee(responseArrivee.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };
    fetchData();
  }, [id]);

 // Filtrer les données selon l'ID de EnteteVente
 const filteredEtatVenteDepart = etatVenteDepart.filter(item => item.enteteVenteID === parseInt(id));
 const filteredEtatVenteArrivee = etatVenteArrivee.filter(item => item.enteteVenteID === parseInt(id));

 // Calculer les totaux globaux filtrés par ID
 const totalDepart = filteredEtatVenteDepart.reduce((acc, item) => acc + item.valeur, 0);
 const totalArrivee = filteredEtatVenteArrivee.reduce((acc, item) => acc + item.valeur, 0);
 const difference = totalDepart - totalArrivee;

  // Indexer etatVenteDepart pour un accès rapide
  const departMap = Object.fromEntries(etatVenteDepart.map(item => [item.description, item]));

  // Construire la liste des comparaisons
  const generateConfrontationData = () => {
    const data = etatVenteArrivee
    .filter(arriveeItem => arriveeItem.enteteVenteID === parseInt(id))
    .map(arriveeItem => {
      const departItem = departMap[arriveeItem.description] || {};
      return {
        code: arriveeItem.code,
        description: arriveeItem.description,
        qtDotationDepart: departItem.qtDotation || 0,
        qtDotationArrivee: arriveeItem.quantiteDotation,
        quantiteVenteDepart: departItem.quantiteVente || 0,
        quantiteVenteArrivee: arriveeItem.quantiteVendue,
        prixUnitaireHTDepart: departItem.prixUnitaireHT || 0,
        prixUnitaireHTArrivee: arriveeItem.prixUnitaireHT,
        valeurDepart: departItem.valeur,
        valeurArrivee: arriveeItem.valeur,
        restantDepart: departItem.restant || 0,
        restantArrivee: arriveeItem.restant,
        id: arriveeItem.enteteVenteID // Assuming each item has a unique _id
      };
    });
    setConfrontationData(data);
  };

  useEffect(() => {
    generateConfrontationData();
  }, [etatVenteArrivee, etatVenteDepart]); // Rebuild data when data changes

  // Fonction pour mettre à jour le statut via l'API
  const updateStatut = async (statut) => {
    try {
      console.log("Request Data: ", { statut,id});  // Log request data to verify it's correct
      const response = await axios.put("http://localhost:5000/api/EnteteVente/updateStatus", { statut, id });
      console.log("Réponse de la mise à jour du statut:", response.data);
      alert("Statut mis à jour avec succès dans la base de données!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error.response ? error.response.data : error);
    }
  };  

  // Pagination handling
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  return (
    <div style={styles.container}>
       <Undo2
              style={{ cursor: "pointer", color: "#B71C1C" }}
              size={28}
              onClick={() => navigate(-1)}
            />
      {/* Totaux globaux dans des Box Material UI */}
      <Box display="flex" flexDirection="row" gap={5} justifyContent="center">
        <Box display="flex" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={2} width={200} minHeight={60}>
          <Typography variant="h6" color="primary">Total Tunisair: {totalDepart} {symbol}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={2} width={200} minHeight={60}>
          <Typography variant="h6" color="secondary">Total Fournisseur: {totalArrivee} {symbol}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={2} width={200} minHeight={60}>
          <Typography variant="h6" color="primary">Ecart: {difference} {symbol}</Typography>
        </Box>
      </Box>

      {/* Sélecteur de statut global */}
      <Box display="flex" justifyContent="center" mb={3}>
        <FormControl>
          <InputLabel>Statut</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Statut"
          >
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Not Approved">Not Approved</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={() => updateStatut(selectedStatus)} sx={{ marginLeft: 2 }}>
          Mettre à jour le statut global
        </Button>
      </Box>

      {/* Tableau de confrontation */}
      <Paper elevation={3} sx={{ marginTop: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Qt Dotation Départ</TableCell>
              <TableCell>Qt Dotation Arrivée</TableCell>
              <TableCell>Qt Vente Départ</TableCell>
              <TableCell>Qt Vente Arrivée</TableCell>
              <TableCell>Prix Unitaire HT Départ</TableCell>
              <TableCell>Prix Unitaire HT Arrivée</TableCell>
              <TableCell>Valeur Départ</TableCell>
              <TableCell>Valeur Arrivée</TableCell>
              <TableCell>Restant Départ</TableCell>
              <TableCell>Restant Arrivée</TableCell>
              <TableCell>EnteteVenteID</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {confrontationData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.qtDotationDepart}</TableCell>
                  <TableCell>{item.qtDotationArrivee}</TableCell>
                  <TableCell>{item.quantiteVenteDepart}</TableCell>
                  <TableCell>{item.quantiteVenteArrivee}</TableCell>
                  <TableCell>{item.prixUnitaireHTDepart}</TableCell>
                  <TableCell>{item.prixUnitaireHTArrivee}</TableCell>
                  <TableCell>{item.valeurDepart}</TableCell>
                  <TableCell>{item.valeurArrivee}</TableCell>
                  <TableCell>{item.restantDepart}</TableCell>
                  <TableCell>{item.restantArrivee}</TableCell>
                  <TableCell>{item.id}</TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={confrontationData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const styles = {
  container: {
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  }
};

export default Confrontation;

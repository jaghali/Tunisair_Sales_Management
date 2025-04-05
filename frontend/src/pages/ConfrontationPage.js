import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TablePagination } from "@mui/material";

const Confrontation = () => {
  const [etatVenteDepart, setEtatVenteDepart] = useState([]);
  const [etatVenteArrivee, setEtatVenteArrivee] = useState([]);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

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
  }, []);

  // Calculer les totaux globaux
  const totalDepart = etatVenteDepart.reduce((acc, item) => acc + item.valeur, 0);
  const totalArrivee = etatVenteArrivee.reduce((acc, item) => acc + item.valeur, 0);
  const difference = totalDepart - totalArrivee;

  // Indexer etatVenteDepart pour un accès rapide
  const departMap = Object.fromEntries(etatVenteDepart.map(item => [item.description, item]));

  // Construire la liste des comparaisons
  const confrontationData = etatVenteArrivee.map(arriveeItem => {
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
    };
  });

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
      {/* Totaux globaux dans des Box Material UI */}
      <Box display="flex" flexDirection="row" gap={5} justifyContent="center">
        <Box display="flex" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={2} width={200} minHeight={60}>
              <Typography variant="h6" color="primary">Total Départ: {totalDepart}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={2} width={200} minHeight={60}>
              <Typography variant="h6" color="secondary">Total Arrivée: {totalArrivee}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={2} width={200} minHeight={60}>
             <Typography variant="h6" color="primary">Ecart: {difference}</Typography>
        </Box>
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
    alignItems: "center",
    borderRadius: "10px",
  },
  


}
export default Confrontation;

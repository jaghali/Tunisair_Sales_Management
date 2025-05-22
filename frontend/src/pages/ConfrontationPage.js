import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { RotateCcw, Undo2, Plane, Package, ShieldOff } from "lucide-react";
import { useCurrency } from "../pages/CurrencyContext";
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";
import { CustomAnimatedSelect, MenuItem } from "../components/common/AnimatedSelectComponents";
import { Select } from "@mui/material";

const Confrontation = () => {
  const [etatVenteDepart, setEtatVenteDepart] = useState([]);
  const [etatVenteArrivee, setEtatVenteArrivee] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confrontationData, setConfrontationData] = useState([]);
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { id } = useParams();
  const [status, setStatus] = useState("Approved");

  // Currency symbol helper
  const getCurrencySymbol = (code) => {
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
  };

  const symbol = getCurrencySymbol(currency);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseDepart, responseArrivee] = await Promise.all([
          axios.get("http://localhost:5000/api/EtatVentesDepart"),
          axios.get("http://localhost:5000/api/EtatVentesarrivee"),
        ]);
        setEtatVenteDepart(responseDepart.data);
        setEtatVenteArrivee(responseArrivee.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };
    fetchData();
  }, [id]);

  const filteredEtatVenteDepart = etatVenteDepart.filter(
    (item) => item.enteteVenteID === parseInt(id)
  );
  const filteredEtatVenteArrivee = etatVenteArrivee.filter(
    (item) => item.enteteVenteID === parseInt(id)
  );

  const totalDepart = filteredEtatVenteDepart.reduce((acc, item) => acc + item.valeur, 0);
  const totalArrivee = filteredEtatVenteArrivee.reduce((acc, item) => acc + item.valeur, 0);
  const difference = totalDepart - totalArrivee;

  const departMap = Object.fromEntries(
    filteredEtatVenteDepart.map((item) => [item.description, item])
  );

  const generateConfrontationData = () => {
    const data = filteredEtatVenteArrivee.map((arriveeItem) => {
      const departItem = departMap[arriveeItem.description] || {};
      return {
        code: arriveeItem.code,
        description: arriveeItem.description,
        qtDotationDepart: departItem.qtDotation || 0,
        qtDotationArrivee: arriveeItem.quantiteDotation,
        quantiteVenteDepart: departItem.quantiteVente || 0,
        quantiteVenteArrivee: arriveeItem.quantiteVendue,
        prixUnitaireHTDepart: departItem.prixUnitaireHT || 0,
        prixUnitaireHTArrivee: arriveeItem.prixUnitaireHT || 0,
        valeurDepart: departItem.valeur || 0,
        valeurArrivee: arriveeItem.valeur || 0,
        restantDepart: departItem.restant || 0,
        restantArrivee: arriveeItem.restant || 0,
        id: arriveeItem.enteteVenteID,
      };
    });
    setConfrontationData(data);
  };

  useEffect(() => {
    generateConfrontationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etatVenteArrivee, etatVenteDepart]);

  const updateStatut = async (newStatus) => {
    try {
      console.log("Request Data: ", { statut: newStatus, id });
      const response = await axios.put("http://localhost:5000/api/EnteteVente/updateStatus", {
        statut: newStatus,
        id,
      });
      console.log("Réponse de la mise à jour du statut:", response.data);
      alert("Statut mis à jour avec succès dans la base de données!");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut",
        error.response ? error.response.data : error
      );
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={styles.container}>
      <Undo2
        style={{ cursor: "pointer", color: "#B71C1C" }}
        size={28}
        onClick={() => navigate(-1)}
        title="Retour"
      />

      <div style={styles.statsGrid}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <StatCard
              name="Total Tunisair:"
              icon={Plane}
              value={`${totalDepart.toFixed(2)} ${symbol}`}
              color="#c0392b"
            />
            <StatCard
              name="Total Fournisseur:"
              icon={Package}
              value={`${totalArrivee.toFixed(2)} ${symbol}`}
              color="#3498db"
            />
            <StatCard
              name="Écart:"
              icon={ShieldOff}
              value={`${difference.toFixed(2)} ${symbol}`}
              color="#e67e22"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
  style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: 24  ,marginLeft:"65%"}}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <FormControl sx={{ minWidth: 200 }}>
    <InputLabel id="select-status-label">Statut</InputLabel>
    <Select
  labelId="select-status-label"
  id="select-status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  label="Statut"
  displayEmpty
>
  <MenuItem value="Approved">Approved</MenuItem>
  <MenuItem value="Not Approved">Not Approved</MenuItem>
</Select>
  </FormControl>

  <motion.button
    onClick={() => updateStatut(status)}
    style={styles.UpdateButton}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300 }}
    type="button"
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <RotateCcw />
      Mettre à jour le statut global
    </div>
  </motion.button>
</motion.div>


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
                  <TableCell>{item.valeurDepart.toFixed(2)}</TableCell>
                  <TableCell>{item.valeurArrivee.toFixed(2)}</TableCell>
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
    </div>
  );
};

const styles = {
  container: {
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowX: "hidden",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  statsGrid: {
    width: "100%",
    marginLeft: "19%",
  },
  UpdateButton: {
    padding: "20px 20px",
    backgroundColor: "#C80505",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Confrontation;
